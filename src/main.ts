import { Plugin, TFile, Notice } from 'obsidian';
import { NoteShortcutSettingTab, ShortcutItem } from './settings';

export interface PluginSettings {
	shortcuts: ShortcutItem[];
}

const DEFAULT_SETTINGS: PluginSettings = {
	shortcuts: [],
};

export default class NoteShortcutPlugin extends Plugin {
	settings!: PluginSettings;
	registeredCommandIds: string[] = [];

	async onload() {
		await this.loadSettings();
		this.updateCommands();
		this.addSettingTab(new NoteShortcutSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// רענון ורישום מחדש של הפקודות באובסידיאן
	updateCommands() {
		const appCommands = (this.app as any).commands;
		for (const id of this.registeredCommandIds) {
			if (
				appCommands &&
				typeof appCommands.removeCommand === 'function'
			) {
				appCommands.removeCommand(id);
			}
		}
		this.registeredCommandIds = [];

		for (const shortcut of this.settings.shortcuts) {
			if (!shortcut.name || !shortcut.filePath) continue;

			const commandId = `note-shortcut-${shortcut.id}`;
			const cmd = this.addCommand({
				id: commandId,
				name: shortcut.name,
				icon: shortcut.icon || 'file',
				callback: () => this.openNote(shortcut.filePath),
			});

			if (cmd) {
				this.registeredCommandIds.push(cmd.id);
			}
		}
	}

	async openNote(filePath: string) {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file && file instanceof TFile) {
			const leaf = this.app.workspace.getLeaf(false);
			await leaf.openFile(file);
		} else {
			new Notice(`Note Shortcut: File not found at "${filePath}"`);
		}
	}
}
