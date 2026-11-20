import os
import zipfile

ZIP_NAME = "LIFE_LINES_FINAL_SUBMISSION.zip"
SUBMISSION_DIR = os.path.abspath("submission")
ZIP_OUT_PATH = os.path.join(SUBMISSION_DIR, ZIP_NAME)
ROOT_ZIP_PATH = os.path.abspath(ZIP_NAME)

# Paths and patterns to include in the submission ZIP
# Explicit whitelist ensuring no node_modules, temp files, or private items
include_dirs = [
    "src",
    "docs",
    "public",
    "screenshots",
    "tests",
    ".github"
]

include_files = [
    "README.md",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "index.html",
    ".gitignore",
    "FINAL_GAMEPLAY_AUDIT.md",
    "LIFE_LINES_Gameplay_Demo.mp4"
]

print(f"Creating {ZIP_NAME}...")

with zipfile.ZipFile(ZIP_OUT_PATH, 'w', zipfile.ZIP_DEFLATED) as zf:
    # 1. Add individual root files
    for f in include_files:
        if os.path.exists(f):
            zf.write(f, arcname=f)
            print(f"Added file: {f}")
        else:
            print(f"Warning: {f} not found")
            
    # 2. Add directories recursively
    for d in include_dirs:
        if os.path.exists(d):
            for root, dirs, files in os.walk(d):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, ".")
                    zf.write(full_path, arcname=rel_path)
            print(f"Added directory tree: {d}")

# Copy to root directory as well
import shutil
shutil.copy2(ZIP_OUT_PATH, ROOT_ZIP_PATH)

size_mb = os.path.getsize(ZIP_OUT_PATH) / (1024 * 1024)
print(f"\nSUCCESS! ZIP Archive generated:")
print(f"- {ZIP_OUT_PATH} ({size_mb:.2f} MB)")
print(f"- {ROOT_ZIP_PATH} ({size_mb:.2f} MB)")

# Verify ZIP integrity
with zipfile.ZipFile(ZIP_OUT_PATH, 'r') as zf:
    bad_file = zf.testzip()
    if bad_file:
        print(f"ERROR: Corrupted file in zip: {bad_file}")
    else:
        print(f"INTEGRITY CHECK PASSED: Archive is valid with {len(zf.namelist())} files.")
