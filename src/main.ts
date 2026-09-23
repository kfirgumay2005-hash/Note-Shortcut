import { Plugin, TFile, Notice, App } from 'obsidian';
import { NoteShortcutSettingTab, ShortcutItem } from './settings';

export interface PluginSettings {
	shortcuts: ShortcutItem[];
}

const DEFAULT_SETTINGS: PluginSettings = {
	shortcuts: [],
};

// הגדרת ממשק כדי למנוע את שגיאות ה-any על this.app.commands
export interface AppWithCommands extends App {
	commands: {
		removeCommand(id: string): void;
		executeCommandById(id: string): void;
	};
}

export default class NoteShortcutPlugin extends Plugin {
	settings!: PluginSettings;
	registeredCommandIds: string[] = [];

	async onload(): Promise<void> {
		await this.loadSettings();

		// הוספת פקודה מובנית לחזרה לפתק הקודם בהיסטוריה (Back)
		this.addCommand({
			id: 'go-back-note',
			name: 'Go to Previous Note (Back)',
			icon: 'arrow-left',
			callback: () => {
				(this.app as AppWithCommands).commands.executeCommandById(
					'app:go-back',
				);
			},
		});

		// הוספת פקודה מובנית להתקדמות לפתק הבא בהיסטוריה (Forward)
		this.addCommand({
			id: 'go-forward-note',
			name: 'Go to Next Note (Forward)',
			icon: 'arrow-right',
			callback: () => {
				(this.app as AppWithCommands).commands.executeCommandById(
					'app:go-forward',
				);
			},
		});

		this.updateCommands();
		this.addSettingTab(new NoteShortcutSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		// מונע שגיאת Unsafe assignment של any
		const loadedData =
			(await this.loadData()) as Partial<PluginSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	updateCommands(): void {
		const appWithCommands = this.app as AppWithCommands;

		// הסרת פקודות ישנות בצורה בטוחה ללא member access errors
		for (const id of this.registeredCommandIds) {
			if (
				appWithCommands.commands &&
				typeof appWithCommands.commands.removeCommand === 'function'
			) {
				appWithCommands.commands.removeCommand(id);
			}
		}
		this.registeredCommandIds = [];

		// רישום פקודות חדשות מההגדרות
		for (const shortcut of this.settings.shortcuts) {
			if (!shortcut.name || !shortcut.filePath) continue;

			const commandId = `note-shortcut-${shortcut.id}`;
			const cmd = this.addCommand({
				id: commandId,
				name: shortcut.name,
				icon: shortcut.icon || 'file',
				callback: () => {
					void this.openNote(shortcut.filePath);
				},
			});

			if (cmd) {
				this.registeredCommandIds.push(cmd.id);
			}
		}
	}

	async openNote(filePath: string): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file && file instanceof TFile) {
			const leaf = this.app.workspace.getLeaf(false);
			await leaf.openFile(file);
		} else {
			new Notice(`Note Shortcut: File not found at "${filePath}"`);
		}
	}
}
