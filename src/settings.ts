import {
	App,
	PluginSettingTab,
	Setting,
	FuzzySuggestModal,
	FuzzyMatch,
	setIcon,
	getIconIds,
	TFile,
} from 'obsidian';
import NoteShortcutPlugin from './main';

export interface ShortcutItem {
	id: string;
	name: string;
	filePath: string;
	icon: string;
}

// רשימה מורחבת של מאות אייקוני Lucide נפוצים ומתקדמים
const EXTRA_LUCIDE_ICONS: string[] = [
	'activity',
	'airplay',
	'alarm-clock',
	'alert-circle',
	'alert-octagon',
	'alert-triangle',
	'align-center',
	'align-justify',
	'align-left',
	'align-right',
	'anchor',
	'aperture',
	'archive',
	'arrow-big-down',
	'arrow-big-left',
	'arrow-big-right',
	'arrow-big-up',
	'arrow-down',
	'arrow-down-left',
	'arrow-down-right',
	'arrow-left',
	'arrow-right',
	'arrow-up',
	'arrow-up-left',
	'arrow-up-right',
	'at-sign',
	'award',
	'axe',
	'backpack',
	'badge',
	'banknote',
	'bar-chart',
	'bar-chart-2',
	'bar-chart-3',
	'bar-chart-4',
	'baseline',
	'battery',
	'battery-charging',
	'bell',
	'bell-off',
	'bell-ring',
	'bike',
	'binary',
	'bitcoin',
	'bluetooth',
	'book',
	'book-open',
	'bookmark',
	'box',
	'boxes',
	'briefcase',
	'brush',
	'bug',
	'building',
	'bus',
	'calculator',
	'calendar',
	'camera',
	'candlestick-chart',
	'car',
	'cast',
	'check',
	'check-circle',
	'check-square',
	'chef-hat',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'chevron-up',
	'chevrons-down',
	'chevrons-left',
	'chevrons-right',
	'chevrons-up',
	'chrome',
	'circle',
	'clapperboard',
	'clipboard',
	'clipboard-check',
	'clipboard-list',
	'clock',
	'cloud',
	'cloud-drizzle',
	'cloud-lightning',
	'cloud-rain',
	'cloud-snow',
	'code',
	'code-2',
	'coffee',
	'cog',
	'coins',
	'columns',
	'command',
	'compass',
	'contact',
	'copy',
	'cpu',
	'credit-card',
	'crop',
	'crosshair',
	'crown',
	'database',
	'delete',
	'diamond',
	'dice-1',
	'dice-5',
	'disc',
	'divide',
	'dollar-sign',
	'download',
	'droplet',
	'drum',
	'ear',
	'edit',
	'edit-2',
	'edit-3',
	'egg',
	'eraser',
	'euro',
	'eye',
	'eye-off',
	'factory',
	'fast-forward',
	'feather',
	'figma',
	'file',
	'file-check',
	'file-code',
	'file-digit',
	'file-input',
	'file-output',
	'file-plus',
	'file-text',
	'files',
	'film',
	'filter',
	'fingerprint',
	'flag',
	'flame',
	'flash-light',
	'folder',
	'folder-minus',
	'folder-plus',
	'folder-tree',
	'frown',
	'fuel',
	'gamepad',
	'gamepad-2',
	'gauge',
	'gavel',
	'gem',
	'ghost',
	'gift',
	'git-branch',
	'git-commit',
	'git-fork',
	'git-merge',
	'git-pull-request',
	'glass-water',
	'globe',
	'glasses',
	'graduational-cap',
	'grid',
	'hammer',
	'hand',
	'hard-drive',
	'hash',
	'headphones',
	'headset',
	'heart',
	'help-circle',
	'history',
	'home',
	'hour-glass',
	'ice-cream',
	'image',
	'inbox',
	'infinity',
	'info',
	'instagram',
	'italic',
	'key',
	'keyboard',
	'laptop',
	'layers',
	'layout',
	'layout-grid',
	'layout-list',
	'life-buoy',
	'lightbulb',
	'link',
	'link-2',
	'linkedin',
	'list',
	'list-ordered',
	'list-todo',
	'loader',
	'lock',
	'log-in',
	'log-out',
	'magnet',
	'mail',
	'map',
	'map-pin',
	'maximize',
	'maximize-2',
	'medal',
	'megaphone',
	'menu',
	'message-circle',
	'message-square',
	'mic',
	'mic-off',
	'minimize',
	'minimize-2',
	'minus',
	'monitor',
	'moon',
	'more-horizontal',
	'more-vertical',
	'mountain',
	'mouse',
	'move',
	'music',
	'navigation',
	'network',
	'newspaper',
	'octagon',
	'package',
	'palette',
	'paperclip',
	'pause',
	'pen-tool',
	'pencil',
	'percent',
	'phone',
	'phone-call',
	'phone-incoming',
	'phone-outgoing',
	'pie-chart',
	'pin',
	'plane',
	'play',
	'plug',
	'plus',
	'plus-circle',
	'plus-square',
	'power',
	'printer',
	'qr-code',
	'radio',
	'receipt',
	'redact',
	'refresh-cw',
	'repeat',
	'reply',
	'rocket',
	'rotate-cw',
	'rss',
	'ruler',
	'save',
	'scale',
	'scan',
	'scissors',
	'screen-share',
	'search',
	'send',
	'server',
	'settings',
	'share',
	'share-2',
	'shield',
	'shield-alert',
	'shield-check',
	'ship',
	'shirt',
	'shopping-bag',
	'shopping-cart',
	'shovel',
	'shower-head',
	'shrink',
	'shuffle',
	'sidebar',
	'signal',
	'skull',
	'slack',
	'slash',
	'sliders',
	'smartphone',
	'smile',
	'snowflake',
	'sparkles',
	'speaker',
	'square',
	'stamp',
	'star',
	'sticker',
	'stop-circle',
	'sun',
	'swords',
	'sword',
	'syringe',
	'table',
	'tablet',
	'tag',
	'target',
	'terminal',
	'thermometer',
	'thumbs-down',
	'thumbs-up',
	'ticket',
	'timer',
	'toggle-left',
	'toggle-right',
	'trash',
	'trash-2',
	'tree-pine',
	'trophy',
	'truck',
	'tv',
	'twitch',
	'twitter',
	'umbrella',
	'underline',
	'unlock',
	'upload',
	'user',
	'user-check',
	'user-minus',
	'user-plus',
	'user-x',
	'users',
	'utensils',
	'video',
	'video-off',
	'voicemail',
	'volume-2',
	'volume-x',
	'wallet',
	'wand',
	'watch',
	'wifi',
	'wind',
	'wrench',
	'youtube',
	'zap',
	'zoom-in',
	'zoom-out',
];

// ------------------------------------------------------------
// חלון קופץ לבחירת אייקון מתוך מאגר מורחב של מאות אייקונים
// ------------------------------------------------------------
export class IconSuggestModal extends FuzzySuggestModal<string> {
	onChoose: (iconName: string) => void;

	constructor(app: App, onChoose: (iconName: string) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder('Search from 500+ Lucide icons...');
	}

	getItems(): string[] {
		// איחוד האייקונים הקיימים בזיכרון של אובסידיאן עם רשימת ה-Lucide המורחבת
		const allIcons = new Set([...getIconIds(), ...EXTRA_LUCIDE_ICONS]);
		return Array.from(allIcons);
	}

	getItemText(item: string): string {
		return item;
	}

	renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement) {
		super.renderSuggestion(item, el);
		const iconContainer = el.createSpan({ cls: 'suggestion-icon' });
		iconContainer.style.marginRight = '10px';

		// טעינת תצוגה מקדימה של האייקון
		setIcon(iconContainer, item.item);
		el.prepend(iconContainer);
	}

	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(item);
	}
}

// ------------------------------------------------------------
// חלון קופץ לבחירת פתק ספציפי מתוך הכספת
// ------------------------------------------------------------
export class FileSuggestModal extends FuzzySuggestModal<TFile> {
	onChoose: (file: TFile) => void;

	constructor(app: App, onChoose: (file: TFile) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder('Search vault note...');
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(file: TFile): string {
		return file.path;
	}

	onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(file);
	}
}

// ------------------------------------------------------------
// מסך ההגדרות של התוסף
// ------------------------------------------------------------
export class NoteShortcutSettingTab extends PluginSettingTab {
	plugin: NoteShortcutPlugin;

	constructor(app: App, plugin: NoteShortcutPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Note Shortcuts Settings' });
		containerEl.createEl('p', {
			text: 'Add custom commands to instantly open specific notes. Assign custom names, pick from 500+ Lucide icons, and select notes directly from your vault.',
		});

		// כפתור הוספה (+)
		new Setting(containerEl)
			.setName('Add New Shortcut')
			.setDesc('Create a new command for a specific note')
			.addButton((btn) =>
				btn
					.setButtonText('+ Add Shortcut')
					.setCta()
					.onClick(async () => {
						this.plugin.settings.shortcuts.push({
							id: Date.now().toString(),
							name: 'New Note Shortcut',
							filePath: '',
							icon: 'file-text',
						});
						await this.plugin.saveSettings();
						this.plugin.updateCommands();
						this.display();
					}),
			);

		containerEl.createEl('hr');

		// הצגת הרשימה הקיימת ועריכת כל פריט
		this.plugin.settings.shortcuts.forEach((shortcut, index) => {
			const settingDiv = containerEl.createDiv({
				cls: 'note-shortcut-item',
			});
			settingDiv.style.marginBottom = '20px';
			settingDiv.style.padding = '10px';
			settingDiv.style.border =
				'1px solid var(--background-modifier-border)';
			settingDiv.style.borderRadius = '8px';

			// שם הפקודה
			new Setting(settingDiv)
				.setName(`Shortcut #${index + 1} Name`)
				.addText((text) =>
					text
						.setPlaceholder('Command Name')
						.setValue(shortcut.name)
						.onChange(async (value) => {
							shortcut.name = value;
							await this.plugin.saveSettings();
							this.plugin.updateCommands();
						}),
				);

			// לבחור פתק מהכספת
			new Setting(settingDiv)
				.setName('Target Note')
				.setDesc(
					shortcut.filePath
						? `Current: ${shortcut.filePath}`
						: 'No note selected',
				)
				.addButton((btn) =>
					btn
						.setButtonText(
							shortcut.filePath ? 'Change Note' : 'Select Note',
						)
						.onClick(() => {
							new FileSuggestModal(
								this.app,
								async (file: TFile) => {
									shortcut.filePath = file.path;
									if (
										!shortcut.name ||
										shortcut.name === 'New Note Shortcut'
									) {
										shortcut.name = `Open: ${file.basename}`;
									}
									await this.plugin.saveSettings();
									this.plugin.updateCommands();
									this.display();
								},
							).open();
						}),
				);

			new Setting(settingDiv)
				.setName('Command Icon')
				.setDesc('Click to choose Lucide icon')
				.addButton((btn) => {
					btn.setButtonText(shortcut.icon || 'file-text');
					btn.setIcon(shortcut.icon || 'file-text');
					btn.onClick(() => {
						new IconSuggestModal(
							this.app,
							async (iconName: string) => {
								shortcut.icon = iconName;
								await this.plugin.saveSettings();
								this.plugin.updateCommands();
								this.display();
							},
						).open();
					});
				})
				.addButton((btn) =>
					btn
						.setButtonText('Delete')
						.setWarning()
						.onClick(async () => {
							this.plugin.settings.shortcuts.splice(index, 1);
							await this.plugin.saveSettings();
							this.plugin.updateCommands();
							this.display();
						}),
				);
		});
	}
}
