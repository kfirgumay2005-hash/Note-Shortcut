# Note-Shortcut

Access a specific note in an instant using editing toolbar plugin. Perfect for mobile.

ote Shortcut

An Obsidian plugin that turns notes (or folders) into commands, so you can open them instantly from the command palette, a hotkey, or a toolbar button, which is especially handy on mobile.

## Features

Note shortcuts: pick a note and get a command that opens it.
Latest-in-folder shortcuts: pick a folder and get a command that opens the most recently created or modified note in that folder (including its subfolders).
Follows your files: if you rename or move a note or folder, the shortcut updates automatically, so the command keeps working.
Back / Forward commands: built-in commands for navigating to the previous or next note in your history.
Add as many shortcuts as you like.
Commands
Command Description
Go to Previous Note (Back) Same as Obsidian's back navigation
Go to Next Note (Forward) Same as Obsidian's forward navigation
Your shortcut names One command per shortcut you create
Usage
Create a shortcut to a specific note
Open Settings → Note Shortcut.
Click + Add Shortcut.
Leave Type as Specific note.
Click Select Note and choose a note.
(Optional) Edit the command name. By default it is Open: <note name>.

The new command is available right away in the command palette.

Create a "latest note in folder" shortcut
Click + Add Shortcut.
Set Type to Latest note in folder.
Click Select Folder and choose a folder.

Each time you run the command, it opens the note in that folder with the most recent modification time. Example: with a Chapters folder, creating Chapter 2 makes the command open it; editing Chapter 1 afterwards makes the command open Chapter 1.

## Notes:

Subfolders are included.
If the folder has no notes, a notice is shown and nothing opens.
Selecting / uses the whole vault.
Delete a shortcut

Click Delete under the shortcut in the settings.

Using with the Editing Toolbar (mobile)

To get one-tap access on your phone:

Install and enable the Editing Toolbar plugin.
In its settings, add a new command to the toolbar.
Choose your shortcut's command (it appears under its name, prefixed with the plugin name).
Pick any icon you like there. Icons are managed by Editing Toolbar, not by this plugin.

Because command IDs stay the same when files are renamed or moved, your toolbar buttons keep working.

Notes and limitations
"Latest" is based on the file's modified time, which also changes when a note is created.
Shortcuts only work for Markdown notes.
If a shortcut's target note was deleted, a notice says the file was not found.
Installation (manual)
Build the plugin (npm run build) to produce main.js.
Copy main.js, manifest.json (and styles.css if present) into <vault>/.obsidian/plugins/note-shortcut/.
Reload Obsidian and enable Note Shortcut under Settings → Community plugins.
