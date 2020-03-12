/*
 * @Author: luogizz
 * @Date: 2020-03-12 12:10:32
 * @Last Modified by:   luogizz
 * @Last Modified time: 2020-03-12 12:10:32
 */

import * as vscode from 'vscode';
import { DocumentSelector } from 'vscode';

/**
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {

	let sel: DocumentSelector = { scheme: 'file', language: 'lua' };

	let provider1 = vscode.languages.registerCompletionItemProvider(sel, {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			const line = document.lineAt(position.line + 1);
			const text = line.text;

			let functionStartIndex = text.indexOf(":");

			if (functionStartIndex <= 0) {
				functionStartIndex = text.indexOf(".");
				functionStartIndex = functionStartIndex + 1;
			} else {
				functionStartIndex = functionStartIndex + 1;
			}

			if (functionStartIndex <= 0) {
				functionStartIndex = text.indexOf("function");
				functionStartIndex = functionStartIndex + 8;
			}



			const functionEndIndex = text.indexOf("(");
			const functionName = text.substring(functionStartIndex, functionEndIndex).replace(" ", "");
			const paramsEndIndex = text.indexOf(")");
			const paramsText = text.substring(functionEndIndex + 1, paramsEndIndex);
			const params = paramsText.split(",");

			const snippetCompletion = new vscode.CompletionItem('antt');
			let baseStr = '-- ************************************************************\n-- ' + functionName;

			params.forEach(element => {
				if (element.length > 0) {
					baseStr = baseStr + '\n-- @' + element.replace(" ", "");
				}

			});

			baseStr = baseStr + '\n-- ************************************************************';

			snippetCompletion.insertText = new vscode.SnippetString(baseStr);
			snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");


			return [
				snippetCompletion
			];
		}
	});


	context.subscriptions.push(provider1);
}
