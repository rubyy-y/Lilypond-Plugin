import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    const playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

    playButton.text = '$(play) Run Lilypond';
    playButton.tooltip = 'Click to execute Lilypond';
    playButton.color = 'green';
    playButton.command = 'extension.runLilypond';

    playButton.show();

    const runLilyCommand = vscode.commands.registerCommand('extension.runLilypond', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const filePath = editor.document.uri.fsPath;
            const directoryPath = path.dirname(filePath);

            if (path.extname(filePath) !== '.ly') {
                vscode.window.showErrorMessage('Selected file is not a lilypond file (.ly)');
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
                vscode.window.showErrorMessage('LilyPond could not be executed. Please check the path.');
            });

            lilypondProcess.on('close', (code) => {
                if (code === 0) {
                    vscode.window.showInformationMessage('Executing LilyPond!');
                } else {
                    vscode.window.showErrorMessage('Error. Lilypond could not be executed.');
                }
            });

            lilypondProcess.unref();
        } else {
            vscode.window.showErrorMessage('No open editor found. Open a Lilypond file!');
        }
    });

    context.subscriptions.push(playButton);
    context.subscriptions.push(runLilyCommand);
}

export function deactivate() {}
