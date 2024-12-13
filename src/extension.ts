import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "runlilypond" is now active!');


	const playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

    playButton.text = '$(play) Run Lilypond';
    playButton.tooltip = 'Klicken, um LilyPond auszuführen!';
    playButton.color = 'green';
    playButton.command = 'extension.runLilypond';

    playButton.show();

    const runLilyCommand = vscode.commands.registerCommand('extension.runLilypond', () => {
        vscode.window.showInformationMessage('LilyPond wird ausgeführt!');
        
        const terminal = vscode.window.createTerminal('LilyPond');
		const editor = vscode.window.activeTextEditor;

		if (editor){
		const fileName = editor.document.fileName.split(/[/\\]/).pop();
	
		terminal.sendText("/lilypond/lilypond-2.24.4/bin/lilypond " + fileName);
		terminal.show();
	}
    });

    context.subscriptions.push(playButton);
    context.subscriptions.push(runLilyCommand);
}

export function deactivate() {}