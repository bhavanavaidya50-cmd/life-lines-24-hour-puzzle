import asyncio
import json
import os
import subprocess
import tempfile
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9222
GAME_URL = "http://localhost:4173"
SCREENSHOT_DIR = os.path.abspath("screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

class ChromeSession:
    def __init__(self):
        self.proc = None
        self.temp_dir = tempfile.mkdtemp()
        self.ws = None
        self.msg_id = 1

    def start(self):
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            f"--user-data-dir={self.temp_dir}",
            f"--remote-debugging-port={PORT}",
            "--window-size=1200,675",
            GAME_URL
        ]
        self.proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def stop(self):
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=3)
            except:
                self.proc.kill()

    async def connect(self):
        # Poll for CDP endpoint
        for _ in range(30):
            try:
                req = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")
                pages = json.loads(req.read().decode())
                if pages:
                    ws_url = pages[0]["webSocketDebuggerUrl"]
                    self.ws = await websockets.connect(ws_url, max_size=20*1024*1024)
                    return True
            except Exception:
                await asyncio.sleep(0.3)
        return False

    async def send(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        msg = {"id": mid, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(msg))
        while True:
            resp_raw = await self.ws.recv()
            resp = json.loads(resp_raw)
            if resp.get("id") == mid:
                if "error" in resp:
                    raise Exception(f"CDP Error ({method}): {resp['error']}")
                return resp.get("result", {})

    async def evaluate(self, expr):
        res = await self.send("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": True
        })
        val = res.get("result", {}).get("value")
        return val

    async def capture_screenshot(self, filename):
        import base64
        res = await self.send("Page.captureScreenshot", {"format": "png"})
        data = base64.b64decode(res["data"])
        out_path = os.path.join(SCREENSHOT_DIR, filename)
        with open(out_path, "wb") as f:
            f.write(data)
        print(f"Captured screenshot: {filename} ({len(data)} bytes)")

async def main():
    print("--- LAUNCHING CHROME CDP AUTOMATION ---")
    session = ChromeSession()
    session.start()
    try:
        ok = await session.connect()
        if not ok:
            print("Failed to connect to Chrome DevTools Protocol")
            return

        print("Connected to Chrome via CDP!")
        await session.send("Page.enable")
        await session.send("Runtime.enable")

        # Wait 3 seconds for BootScene -> MainMenuScene transition
        print("Waiting for game boot & main menu transition...")
        await asyncio.sleep(3.5)

        # Inspect Active Scene
        scene_key = await session.evaluate("""
            (function() {
                const game = window.Phaser && window.Phaser.GAMES && Object.values(window.Phaser.GAMES)[0];
                if (!game) return 'no_game';
                const active = game.scene.getScenes(true);
                return active.map(s => s.scene.key).join(',');
            })()
        """)
        print(f"Active Scene on boot: {scene_key}")
        await session.capture_screenshot("01_main_menu.png")

        # Inspect UI / Audio / Save system on window
        save_check = await session.evaluate("""
            (function() {
                return localStorage.getItem('LIFELINES_24H_SAVE_DATA_V1');
            })()
        """)
        print(f"Initial SaveData in LocalStorage: {save_check is not None}")

        # Transition to SettingsScene
        print("\nNavigating to Settings Scene...")
        await session.evaluate("""
            (function() {
                const game = Object.values(window.Phaser.GAMES)[0];
                const active = game.scene.getScenes(true)[0];
                active.scene.start('SettingsScene');
            })()
        """)
        await asyncio.sleep(0.8)
        await session.capture_screenshot("02_settings_scene.png")

        # Transition to ProfileScene
        print("\nNavigating to Profile Scene...")
        await session.evaluate("""
            (function() {
                const game = Object.values(window.Phaser.GAMES)[0];
                const active = game.scene.getScenes(true)[0];
                active.scene.start('ProfileScene');
            })()
        """)
        await asyncio.sleep(0.8)
        await session.capture_screenshot("03_profile_scene.png")

        # Transition to ScenarioSelectScene
        print("\nNavigating to Scenario Select Scene...")
        await session.evaluate("""
            (function() {
                const game = Object.values(window.Phaser.GAMES)[0];
                const active = game.scene.getScenes(true)[0];
                active.scene.start('ScenarioSelectScene');
            })()
        """)
        await asyncio.sleep(0.8)
        await session.capture_screenshot("04_scenario_select.png")

        # Test each of the 5 scenarios completely
        for sc_id in range(1, 6):
            print(f"\n==========================================")
            print(f"AUDITING PLAYTHROUGH: SCENARIO 0{sc_id}")
            print(f"==========================================")

            # 1. Start Story Intro
            await session.evaluate(f"""
                (function() {{
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const active = game.scene.getScenes(true)[0];
                    active.scene.start('StoryIntroScene', {{ scenarioId: {sc_id} }});
                }})()
            """)
            await asyncio.sleep(0.8)
            await session.capture_screenshot(f"scenario_{sc_id}_01_intro.png")

            # 2. Enter Investigation Scene
            await session.evaluate(f"""
                (function() {{
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const active = game.scene.getScenes(true)[0];
                    active.scene.start('InvestigationScene', {{ scenarioId: {sc_id} }});
                }})()
            """)
            await asyncio.sleep(0.8)

            # Inspect and click clues
            clue_audit = await session.evaluate("""
                (function() {
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const s = game.scene.getScenes(true)[0];
                    const disc = s.clueSystem.getDiscoveredClues();
                    const all = s.clueSystem.getAllClues();
                    // Discover all remaining clues for thorough audit
                    all.forEach(c => s.clueSystem.discoverClue(c.id));
                    s.selectClue(all[0]);
                    return { total: all.length, discovered: s.clueSystem.getDiscoveredClues().length };
                })()
            """)
            print(f"Clues tested: {clue_audit}")
            await session.capture_screenshot(f"scenario_{sc_id}_02_investigation.png")

            # 3. Enter Planning Board Scene
            await session.evaluate(f"""
                (function() {{
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const prev = game.scene.getScenes(true)[0];
                    prev.scene.start('PlanningBoardScene', {{
                        scenarioId: {sc_id},
                        clueSystem: prev.clueSystem,
                        resourceSystem: prev.resourceSystem
                    }});
                }})()
            """)
            await asyncio.sleep(0.8)

            # Test Task Scheduling & Collision Detection
            sched_audit = await session.evaluate("""
                (function() {
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const s = game.scene.getScenes(true)[0];
                    
                    // Test 1: Manual Collision test
                    const t1 = s.scenario.tasks[0];
                    const t2 = s.scenario.tasks[1];
                    const res1 = s.timelineSystem.scheduleTask(t1, 8);
                    const resColl = s.timelineSystem.scheduleTask(t2, 8); // Collision!
                    
                    // Test 2: Auto-Optimize function
                    s.autoOptimizeSchedule();
                    const scheduled = s.timelineSystem.getScheduled();
                    const validation = s.timelineSystem.validateFullSchedule(s.scenario.mandatoryTasks || []);
                    
                    return {
                        collisionDetected: !resColl.success,
                        collisionReason: resColl.reason,
                        scheduledCount: scheduled.length,
                        isValidSchedule: validation.isValid,
                        issues: validation.issues
                    };
                })()
            """)
            print(f"Timeline schedule audit: {sched_audit}")
            await session.capture_screenshot(f"scenario_{sc_id}_03_planning.png")

            # 4. Proceed to Decision Scene
            await session.evaluate(f"""
                (function() {{
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const prev = game.scene.getScenes(true)[0];
                    prev.scene.start('DecisionScene', {{
                        scenarioId: {sc_id},
                        clueSystem: prev.clueSystem,
                        resourceSystem: prev.resourceSystem,
                        timelineSystem: prev.timelineSystem
                    }});
                }})()
            """)
            await asyncio.sleep(0.8)
            await session.capture_screenshot(f"scenario_{sc_id}_04_decision.png")

            # 5. Play through all decision beats
            decision_audit = await session.evaluate("""
                (function() {
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const s = game.scene.getScenes(true)[0];
                    const beatsCount = s.scenario.storyBeats.length;
                    const decisionsMade = [];

                    while (s.decisionSystem.getCurrentBeat()) {
                        const beat = s.decisionSystem.getCurrentBeat();
                        // Pick optimal first choice
                        const result = s.decisionSystem.chooseOption(0, s.clueSystem, s.resourceSystem);
                        decisionsMade.push({ beat: beat.title, choice: result.record.optionText });
                    }

                    const ending = s.decisionSystem.determineEnding(s.scenario.endings, s.resourceSystem);
                    
                    // Transition to Consequence Scene
                    s.scene.start('ConsequenceScene', {
                        scenarioId: s.scenario.id,
                        clueSystem: s.clueSystem,
                        resourceSystem: s.resourceSystem,
                        timelineSystem: s.timelineSystem,
                        decisionSystem: s.decisionSystem,
                        ending: ending
                    });

                    return { beatsCount, decisionsMade, ending: ending.title };
                })()
            """)
            print(f"Decisions processed: {decision_audit['beatsCount']} beats. Ending reached: '{decision_audit['ending']}'")
            await asyncio.sleep(0.8)
            await session.capture_screenshot(f"scenario_{sc_id}_05_consequence.png")

            # Verify score and star rating
            score_audit = await session.evaluate("""
                (function() {
                    const game = Object.values(window.Phaser.GAMES)[0];
                    const s = game.scene.getScenes(true)[0];
                    return {
                        totalScore: s.scoreResult.totalScore,
                        stars: s.scoreResult.stars,
                        ratingLabel: s.scoreResult.ratingLabel,
                        breakdown: s.scoreResult.breakdown.map(b => `${b.category}: ${b.points}/${b.max}`)
                    };
                })()
            """)
            print(f"Evaluation: {score_audit['totalScore']} pts ({score_audit['stars']} Stars) - {score_audit['ratingLabel']}")

        # Verify progression after playing all 5 scenarios
        final_save = await session.evaluate("""
            (function() {
                const raw = localStorage.getItem('LIFELINES_24H_SAVE_DATA_V1');
                const data = JSON.parse(raw);
                return {
                    completed: data.progress.completedScenarios,
                    unlocked: data.progress.unlockedScenarios,
                    stars: data.progress.scenarioStars,
                    highScores: data.progress.scenarioHighScores
                };
            })()
        """)
        print("\n==========================================")
        print("FINAL PROGRESSION & PERSISTENCE STATE:")
        print(json.dumps(final_save, indent=2))
        print("==========================================")

        # Re-check Profile Scene to see fully unlocked career dossier
        await session.evaluate("""
            (function() {
                const game = Object.values(window.Phaser.GAMES)[0];
                const active = game.scene.getScenes(true)[0];
                active.scene.start('ProfileScene');
            })()
        """)
        await asyncio.sleep(0.8)
        await session.capture_screenshot("05_profile_completed.png")

        # Test Mobile Viewport / Orientation
        print("\nTesting mobile landscape orientation...")
        await session.send("Emulation.setDeviceMetricsOverride", {
            "width": 844,
            "height": 390,
            "deviceScaleFactor": 2,
            "mobile": True,
            "screenOrientation": {"angle": 90, "type": "landscapePrimary"}
        })
        await asyncio.sleep(0.5)
        await session.capture_screenshot("06_mobile_landscape.png")

        print("\nTesting mobile portrait orientation (warning overlay)...")
        await session.send("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 2,
            "mobile": True,
            "screenOrientation": {"angle": 0, "type": "portraitPrimary"}
        })
        await asyncio.sleep(0.5)
        await session.capture_screenshot("07_mobile_portrait_warning.png")

        print("\nALL AUDIT PHASES SUCCESSFULLY EXECUTED!")

    finally:
        session.stop()

if __name__ == "__main__":
    asyncio.run(main())
