import os
import sys
import subprocess

def install_cron():
    print("--- Agashop Auto-Cron Installer ---")
    
    # 1. Détecter les chemins
    base_dir = os.path.dirname(os.path.abspath(__file__))
    manage_py = os.path.join(base_dir, 'manage.py')
    python_exec = sys.executable
    
    if not os.path.exists(manage_py):
        print(f"Error: manage.py not found at {manage_py}")
        return

    print(f"Project Directory: {base_dir}")
    print(f"Python Executable: {python_exec}")
    
    # 2. Construire la commande Cron
    # Exécuter tous les jours à minuit (0 0 * * *)
    # Rediriger la sortie vers un fichier de log
    log_file = os.path.join(base_dir, 'cron_subscriptions.log')
    cron_command = f"{python_exec} {manage_py} check_subscriptions >> {log_file} 2>&1"
    cron_job = f"0 0 * * * {cron_command}"
    
    print(f"\nTarget Cron Job:\n{cron_job}\n")
    
    # 3. Lire la Crontab actuelle
    try:
        # 'crontab -l' liste les tâches actuelles
        current_crontab = subprocess.check_output(['crontab', '-l'], stderr=subprocess.STDOUT).decode('utf-8')
    except subprocess.CalledProcessError as e:
        # Si aucune crontab n'existe, c'est normal (code retour != 0 parfois)
        current_crontab = ""
    except FileNotFoundError:
        print("Error: 'crontab' command not found. Are you on Linux/Unix?")
        return

    # 4. Vérifier si la tâche existe déjà
    if cron_command in current_crontab:
        print("Success: The cron job is ALREADY installed.")
        return

    # 5. Ajouter la nouvelle tâche
    new_crontab = current_crontab + cron_job + "\n"
    
    try:
        # 'crontab -' lit depuis stdin
        process = subprocess.Popen(['crontab', '-'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate(input=new_crontab.encode('utf-8'))
        
        if process.returncode == 0:
            print("Success: Cron job installed successfully!")
            print(f"Logs will be written to: {log_file}")
        else:
            print(f"Error installing cron job: {stderr.decode('utf-8')}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    install_cron()
