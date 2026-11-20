import os
import subprocess
import tempfile
import time
import imageio.v3 as iio
from PIL import Image

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:4173"
SUBMISSION_DIR = os.path.abspath("submission")
os.makedirs(SUBMISSION_DIR, exist_ok=True)
TEMP_FRAMES_DIR = os.path.abspath("temp_video_frames")
os.makedirs(TEMP_FRAMES_DIR, exist_ok=True)

# Sequence of story beats and scenes representing a complete gameplay playthrough
scenes_script = [
    # 1. Main menu and game introduction (3 sec)
    ("scene=MainMenuScene", 3.0, "1. Main Menu - Life Lines"),
    
    # 2. Settings scene & audio controls (2 sec)
    ("scene=SettingsScene", 2.0, "2. Settings & Procedural Audio Engine"),
    
    # 3. Scenario Selection (3 sec)
    ("scene=ScenarioSelectScene", 3.0, "3. Scenario Selection - 5 Adult Casefiles"),
    
    # 4. Casefile 1: Introduction (3 sec)
    ("scene=StoryIntroScene&scenario=1", 3.0, "4. Casefile 01: Alex Chen Strategic Briefing"),
    
    # 5. Casefile 1: Evidence & Investigation (4 sec)
    ("scene=InvestigationScene&scenario=1", 4.0, "5. Forensic Evidence Dossier & Discovery"),
    
    # 6. Casefile 1: Interactive 24-hour Timeline (5 sec)
    ("scene=PlanningBoardScene&scenario=1", 5.0, "6. 24-Hour Timeline Planning & Task Scheduling"),
    
    # 7. Casefile 1: Decision-making and consequences (4 sec)
    ("scene=DecisionScene&scenario=1", 4.0, "7. Ethical Decision Nodes & Branching Impact"),
    
    # 8. Casefile 1: Consequence resolution (3 sec)
    ("scene=ConsequenceScene&scenario=1", 3.0, "8. Consequence Resolution & 4-Axis Scoring"),
    
    # 9. Casefile 2: The Missing Transaction (3 sec)
    ("scene=StoryIntroScene&scenario=2", 3.0, "9. Casefile 02: The Missing Transaction"),
    ("scene=InvestigationScene&scenario=2", 3.0, "10. Financial Wire Forensics & IT Logs"),
    
    # 10. Casefile 3: The Family Secret (3 sec)
    ("scene=StoryIntroScene&scenario=3", 3.0, "11. Casefile 03: The Family Secret"),
    ("scene=InvestigationScene&scenario=3", 3.0, "12. Medical Diagnostics & Sibling Care"),
    
    # 11. Casefile 4: The Business Crisis (3 sec)
    ("scene=StoryIntroScene&scenario=4", 3.0, "13. Casefile 04: The Business Crisis"),
    ("scene=DecisionScene&scenario=4", 3.0, "14. Venture Capital Ultimatum Showdown"),
    
    # 12. Casefile 5: The Final Decision (3 sec)
    ("scene=StoryIntroScene&scenario=5", 3.0, "15. Casefile 05: The Final Decision"),
    ("scene=InvestigationScene&scenario=5", 3.0, "16. Municipal Zoning & Civic Mediation"),
    
    # 13. Player Profile & Achievements (3 sec)
    ("scene=ProfileScene", 3.0, "17. Career Profile & Casefile Mastery")
]

print("Recording actual gameplay screenshots for video composition...")
frame_paths = []
fps = 4 # 4 frames per second is smooth for strategy/puzzle walkthrough, keeping mp4 compact

frame_idx = 0
for query, duration, label in scenes_script:
    frame_file = os.path.join(TEMP_FRAMES_DIR, f"frame_{frame_idx:03d}.png")
    d = tempfile.mkdtemp()
    url = f"{BASE_URL}#{query}"
    cmd = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={d}",
        "--virtual-time-budget=1500",
        f"--screenshot={frame_file}",
        "--window-size=1200,675",
        url
    ]
    try:
        p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        p.wait(timeout=6)
    except subprocess.TimeoutExpired:
        p.kill()
        
    if os.path.exists(frame_file) and os.path.getsize(frame_file) > 10000:
        # Repeat frame according to duration
        repeat_count = int(duration * fps)
        for _ in range(repeat_count):
            frame_paths.append(frame_file)
        print(f"Captured {label} ({duration}s, {repeat_count} frames)")
    else:
        print(f"Skipped frame {label} (missing or empty)")
    frame_idx += 1

print(f"\nAssembling {len(frame_paths)} frames into LIFE_LINES_Gameplay_Demo.mp4...")
video_out_path = os.path.join(SUBMISSION_DIR, "LIFE_LINES_Gameplay_Demo.mp4")
root_video_path = os.path.abspath("LIFE_LINES_Gameplay_Demo.mp4")

# Read frames and write video using imageio
frames = [iio.imread(fp) for fp in frame_paths]
iio.imwrite(video_out_path, frames, fps=fps, codec="libx264")

# Also copy to root directory for convenience
import shutil
shutil.copy2(video_out_path, root_video_path)

size_mb = os.path.getsize(video_out_path) / (1024 * 1024)
print(f"SUCCESS: Video generated at:\n- {video_out_path} ({size_mb:.2f} MB)\n- {root_video_path}")
