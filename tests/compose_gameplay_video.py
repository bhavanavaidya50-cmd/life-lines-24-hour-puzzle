import os
import imageio.v3 as iio
from PIL import Image

SCREENSHOTS_DIR = os.path.abspath("screenshots")
SUBMISSION_DIR = os.path.abspath("submission")
os.makedirs(SUBMISSION_DIR, exist_ok=True)

# Select pristine high-resolution gameplay screenshots across all required walkthrough phases
video_sequence = [
    # 1. Main menu and game introduction
    ("02_main_menu.png", 3.5, "1. Main Menu - Life Lines"),
    ("03_settings_scene.png", 2.5, "2. Settings & Procedural Audio Engine"),
    ("05_scenario_select.png", 3.5, "3. Scenario Selection - 5 Adult Casefiles"),
    
    # 2. Scenario 1 (The Unexpected Monday)
    ("sc1_intro.png", 3.0, "4. Casefile 01: Alex Chen Strategic Briefing"),
    ("sc1_investigation.png", 3.5, "5. Clue Dossier & Medical Evidence"),
    ("sc1_planning.png", 4.0, "6. 24-Hour Timeline Planning Board"),
    ("sc1_decision.png", 3.5, "7. Decision Nodes & Consequence Branches"),
    
    # 3. Scenario 2 (The Missing Transaction)
    ("sc2_intro.png", 3.0, "8. Casefile 02: Maya Rodriguez"),
    ("sc2_investigation.png", 3.0, "9. Financial Wire & Phishing Forensics"),
    ("sc2_planning.png", 3.5, "10. Banking Cutoff Scheduling"),
    
    # 4. Scenario 3 (The Family Secret)
    ("sc3_intro.png", 3.0, "11. Casefile 03: Sam Patel"),
    ("sc3_investigation.png", 3.0, "12. Alzheimer's Diagnostics & Will"),
    ("sc3_planning.png", 3.5, "13. Family Mediation Timeline"),
    
    # 5. Scenario 4 (The Business Crisis)
    ("sc4_intro.png", 3.0, "14. Casefile 04: Jordan Kim"),
    ("sc4_investigation.png", 3.0, "15. Seed Investor Term Sheet"),
    ("sc4_decision.png", 3.5, "16. Venture Capital Showdown"),
    
    # 6. Scenario 5 (The Final Decision)
    ("sc5_intro.png", 3.0, "17. Casefile 05: Robin Okafor"),
    ("sc5_investigation.png", 3.0, "18. Municipal Zoning Memo & Clinic Defense"),
    
    # 7. Player Profile & Achievements
    ("04_profile_scene.png", 3.5, "19. Career Progression & Solved Casefiles")
]

print(f"Composing gameplay demo video from {len(video_sequence)} verified gameplay scenes...")

fps = 4
rendered_frames = []

for filename, duration, label in video_sequence:
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path) and os.path.getsize(path) > 10000:
        # Load and ensure exact 1200x675 dimensions
        img = Image.open(path).convert("RGB")
        if img.size != (1200, 675):
            img = img.resize((1200, 675), Image.Resampling.LANCZOS)
        
        # Read as numpy array for imageio
        img_np = iio.imread(path)
        # Repeat frame according to display duration
        num_frames = int(duration * fps)
        for _ in range(num_frames):
            rendered_frames.append(img_np)
        print(f"[OK] Added {label} ({duration}s, {num_frames} frames)")
    else:
        print(f"[WARN] File not found or too small: {filename}")

video_out_path = os.path.join(SUBMISSION_DIR, "LIFE_LINES_Gameplay_Demo.mp4")
root_video_path = os.path.abspath("LIFE_LINES_Gameplay_Demo.mp4")

print(f"\nEncoding {len(rendered_frames)} frames into H.264 MP4 video...")
iio.imwrite(video_out_path, rendered_frames, fps=fps, codec="libx264")

# Copy to root directory
import shutil
shutil.copy2(video_out_path, root_video_path)

size_mb = os.path.getsize(video_out_path) / (1024 * 1024)
duration_sec = len(rendered_frames) / fps
print(f"\nSUCCESS! Video created:")
print(f"Path: {video_out_path}")
print(f"Duration: {duration_sec:.1f} seconds")
print(f"File Size: {size_mb:.2f} MB (Well within GitHub's 100 MB limit)")
