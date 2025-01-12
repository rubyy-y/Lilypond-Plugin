import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    const playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

    playButton.text = '$(play) Run Lilypond';
    playButton.tooltip = 'Klicken, um LilyPond auszuführen!';
    playButton.color = 'green';
    playButton.command = 'extension.runLilypond';

    playButton.show();

    const runLilyCommand = vscode.commands.registerCommand('extension.runLilypond', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const filePath = editor.document.uri.fsPath;
            const directoryPath = path.dirname(filePath);

            if (path.extname(filePath) !== '.ly') {
                vscode.window.showErrorMessage('Die ausgewählte Datei ist keine LilyPond-Datei (.ly)');
                return;
            }

            const lilypondPath = "/lilypond/lilypond-2.24.4/bin/lilypond";

            const lilypondProcess = spawn(lilypondPath, [filePath], {
                cwd: directoryPath,
                shell: true,
                detached: true,
                stdio: 'ignore'
            });

            lilypondProcess.on('error', () => {
                vscode.window.showErrorMessage('LilyPond konnte nicht ausgeführt werden. Überprüfen Sie den Pfad.');
            });

            lilypondProcess.on('close', (code) => {
                if (code === 0) {
                    vscode.window.showInformationMessage('LilyPond wird ausgeführt!');
                } else {
                    vscode.window.showErrorMessage('Ein Fehler ist aufgetreten. LilyPond konnte nicht abgeschlossen werden.');
                }
            });

            lilypondProcess.unref();
        } else {
            vscode.window.showErrorMessage('Kein aktiver Editor gefunden. Öffnen Sie eine LilyPond-Datei!');
        }
    });

    context.subscriptions.push(playButton);
    context.subscriptions.push(runLilyCommand);
}

export function deactivate() {}
