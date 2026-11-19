import os
import subprocess
import tempfile

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:4173"
OUT_DIR = os.path.abspath("screenshots")
os.makedirs(OUT_DIR, exist_ok=True)

targets = [
    # Main Navigation Screens
    ("01_boot_scene.png", "scene=BootScene", 1500),
    ("02_main_menu.png", "scene=MainMenuScene", 1500),
    ("03_settings_scene.png", "scene=SettingsScene", 1500),
    ("04_profile_scene.png", "scene=ProfileScene", 1500),
    ("05_scenario_select.png", "scene=ScenarioSelectScene", 1500),

    # Scenario 1 (The Unexpected Monday)
    ("sc1_intro.png", "scene=StoryIntroScene&scenario=1", 1500),
    ("sc1_investigation.png", "scene=InvestigationScene&scenario=1", 1500),
    ("sc1_planning.png", "scene=PlanningBoardScene&scenario=1", 1500),
    ("sc1_decision.png", "scene=DecisionScene&scenario=1", 1500),
    ("sc1_consequence.png", "scene=ConsequenceScene&scenario=1", 1500),

    # Scenario 2 (The Missing Transaction)
    ("sc2_intro.png", "scene=StoryIntroScene&scenario=2", 1500),
    ("sc2_investigation.png", "scene=InvestigationScene&scenario=2", 1500),
    ("sc2_planning.png", "scene=PlanningBoardScene&scenario=2", 1500),
    ("sc2_decision.png", "scene=DecisionScene&scenario=2", 1500),
    ("sc2_consequence.png", "scene=ConsequenceScene&scenario=2", 1500),

    # Scenario 3 (The Family Secret)
    ("sc3_intro.png", "scene=StoryIntroScene&scenario=3", 1500),
    ("sc3_investigation.png", "scene=InvestigationScene&scenario=3", 1500),
    ("sc3_planning.png", "scene=PlanningBoardScene&scenario=3", 1500),
    ("sc3_decision.png", "scene=DecisionScene&scenario=3", 1500),
    ("sc3_consequence.png", "scene=ConsequenceScene&scenario=3", 1500),

    # Scenario 4 (The Business Crisis)
    ("sc4_intro.png", "scene=StoryIntroScene&scenario=4", 1500),
    ("sc4_investigation.png", "scene=InvestigationScene&scenario=4", 1500),
    ("sc4_planning.png", "scene=PlanningBoardScene&scenario=4", 1500),
    ("sc4_decision.png", "scene=DecisionScene&scenario=4", 1500),
    ("sc4_consequence.png", "scene=ConsequenceScene&scenario=4", 1500),

    # Scenario 5 (The Final Decision)
    ("sc5_intro.png", "scene=StoryIntroScene&scenario=5", 1500),
    ("sc5_investigation.png", "scene=InvestigationScene&scenario=5", 1500),
    ("sc5_planning.png", "scene=PlanningBoardScene&scenario=5", 1500),
    ("sc5_decision.png", "scene=DecisionScene&scenario=5", 1500),
    ("sc5_consequence.png", "scene=ConsequenceScene&scenario=5", 1500),
]

print(f"Beginning verified screen capture of {len(targets)} screens...")

for filename, query, budget in targets:
    out_file = os.path.join(OUT_DIR, filename)
    d = tempfile.mkdtemp()
    url = f"{BASE_URL}#{query}"
    cmd = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={d}",
        f"--virtual-time-budget={budget}",
        f"--screenshot={out_file}",
        "--window-size=1200,675",
        url
    ]
    try:
        p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        p.wait(timeout=5)
    except subprocess.TimeoutExpired:
        p.kill()
    
    size = os.path.getsize(out_file) if os.path.exists(out_file) else 0
    print(f"[{'OK' if size > 15000 else 'ERR'}] {filename} ({size} bytes)")

print("\nScreen capture complete!")
