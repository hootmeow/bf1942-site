import os
import sys
import subprocess
from urllib.parse import urlparse

# Default DSN (Empty by default, must set POSTGRES_DSN env var)
DEFAULT_DSN = ""

def get_dsn():
    return os.environ.get("POSTGRES_DSN", DEFAULT_DSN)

def migrate_notes():
    dsn = get_dsn()
    if not dsn:
        print("Error: POSTGRES_DSN environment variable not set.")
        sys.exit(1)
        
    parsed = urlparse(dsn)
    
    # Extract components
    dbname = parsed.path.lstrip('/')
    user = parsed.username
    password = parsed.password
    host = parsed.hostname
    port = parsed.port or 5432
    
    print(f"Connecting to {host}:{port}/{dbname} as {user}...")

    # SQL command to add new columns
    sql_command = """
    ALTER TABLE whitelisted_servers 
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS owner_contact TEXT;
    """

    cmd = [
        "psql",
        "-h", host,
        "-p", str(port),
        "-U", user,
        "-d", dbname,
        "-c", sql_command
    ]

    env = os.environ.copy()
    if password:
        env["PGPASSWORD"] = password

    try:
        result = subprocess.run(cmd, env=env, text=True, capture_output=True)
        
        if result.returncode == 0:
            print("Success: Added 'admin_notes' and 'owner_contact' columns.")
            print(result.stdout)
        else:
            print("Error executing psql:")
            print(result.stderr)
            sys.exit(result.returncode)

    except FileNotFoundError:
        print("Error: 'psql' command not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    migrate_notes()
