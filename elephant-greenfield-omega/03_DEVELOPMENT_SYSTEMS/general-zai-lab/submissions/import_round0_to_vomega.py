#!/usr/bin/env python3
"""Import sanitized Z.ai lab snapshots into VOMEGA; never overwrite product code.

Run from a clean local VOMEGA main. Dry-run by default. Apply and push explicitly.
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
import tarfile

ROOT = pathlib.Path("elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS")
SNAPSHOTS = (
    ("general-fresh-turn001.tar.gz", "general-zai-lab/submissions/2026-10-11-fresh-round0/artifacts", "64ab4369e26b49dcbd4575b3b739c4761f1534ebb9019fd96f01d82b2df12ebf"),
    ("general-round0-to-round1.tar.gz", "general-zai-lab/submissions/2026-10-11-r0-r1-continuing/artifacts", "daec5e088c714798413fc53cfbacfe2f9acbb7981737d51bcaf37fe27e0f7718"),
    ("claude-ecp-turns1-2.tar.gz", "proposal-specific/claude-zai/submissions/2026-10-11-turns1-2/artifacts", "b188cc9bdfc5ad9cdefb63b9d446d34a2db36c8c81914fae7c541f99ea82be7b"),
)

def command(repo, *args):
    proc = subprocess.run(list(args), cwd=repo, capture_output=True, text=True)
    if proc.returncode:
        raise RuntimeError(f"{' '.join(args)} failed:\n{proc.stderr}\n{proc.stdout}")
    return proc.stdout.strip()

def inspect_bundle(path, expected_hash):
    payload = path.read_bytes()
    if hashlib.sha256(payload).hexdigest() != expected_hash:
        raise ValueError(f"Snapshot checksum mismatch: {path}")
    with tarfile.open(path, "r:gz") as tf:
        members = tf.getmembers()
        if not members or members[0].name != "TRANSFER-MANIFEST.json":
            raise ValueError("Missing or invalid transfer manifest")
        manifest = json.load(tf.extractfile(members[0]))
        hashes = {x["path"]:x for x in manifest["files"]}
        contents = {}
        for m in members[1:]:
            target = pathlib.PurePosixPath(m.name)
            if not m.isfile() or target.is_absolute() or ".." in target.parts or "\\" in m.name or any(x in target.parts for x in (".git",".env","node_modules",".next")):
                raise ValueError(f"Unsupported or unsafe member: {m.name}")
            if m.name not in hashes:
                raise ValueError(f"Unmanifested member: {m.name}")
            body = tf.extractfile(m).read()
            if hashlib.sha256(body).hexdigest() != hashes[m.name]["sha256"] or len(body) != hashes[m.name]["size"]:
                raise ValueError(f"Incorrect digest or size: {m.name}")
            contents[m.name] = body
        if len(contents) != len(hashes):
            raise ValueError("Manifest/file coverage mismatch")
        return contents

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--repo",required=True,help="Clean local VOMEGA checkout")
    p.add_argument("--archives",required=True,help="Folder containing the three sanitized .tar.gz files")
    p.add_argument("--apply",action="store_true")
    p.add_argument("--push",action="store_true")
    args=p.parse_args()
    if args.push and not args.apply: p.error("--push requires --apply")
    repo=pathlib.Path(args.repo).resolve()
    if not (repo/".git").exists(): raise ValueError("Target must be a Git clone")
    if command(repo,"git","branch","--show-current") != "main": raise ValueError("Must be on main")
    if command(repo,"git","status","--porcelain"): raise ValueError("Checkout must be clean")
    archive_root=pathlib.Path(args.archives).resolve()
    pending=[]
    for name, subdir, hash_value in SNAPSHOTS:
        records=inspect_bundle(archive_root/name, hash_value)
        for rel,body in records.items():
            path=(repo/ROOT/subdir/rel).resolve()
            path.relative_to(repo)
            if path.exists() and path.read_bytes()!=body: raise FileExistsError(f"Refusing overwrite: {path}")
            pending.append((path,body))
        print(f"{name}: {len(records)} verified files")
    print(f"Total: {len(pending)} files to reconcile")
    if not args.apply:
        print("DRY RUN. Add --apply to commit; --push to push safely.")
        return
    command(repo,"git","fetch","origin","main")
    if command(repo,"git","rev-parse","HEAD") != command(repo,"git","rev-parse","origin/main"):
        raise RuntimeError("Local main differs from origin/main; fast-forward, then retry")
    for path,body in pending:
        path.parent.mkdir(parents=True,exist_ok=True)
        if not path.exists(): path.write_bytes(body)
    command(repo,"git","add","--",str(ROOT))
    if not command(repo,"git","diff","--cached","--name-only"):
        print("All files already match. Nothing to commit.")
        return
    command(repo,"git","commit","-m","chore(elephants): import sanitized initial Z.ai experiments and evidence")
    new_sha=command(repo,"git","rev-parse","HEAD")
    print("Committed:",new_sha)
    if args.push:
        command(repo,"git","push","origin","main")
        print("Pushed:",new_sha)

if __name__ == "__main__":
    main()
