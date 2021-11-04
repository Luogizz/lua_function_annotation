/*
 * @Author: luogizz
 * @Date: 2020-03-12 12:10:32
 * @Last Modified by:   luogizz
 * @Last Modified time: 2020-03-12 12:10:32
 */

import * as vscode from 'vscode';
import * as moment from 'moment';
import { DocumentSelector } from 'vscode';
import { futimesSync } from 'fs';

/**
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {

	let sel: DocumentSelector = { scheme: 'file', language: 'lua' };

	function createFuncAnnotationCompletion(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext)
	{
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
		let baseStr = "-- ************************************************************\n";

		// 作者
		let authorStr = "-- @Author: luogizz\n";
		baseStr = baseStr + authorStr;

		// 时间
		let formattedDateStr =`-- @Date: ${(moment(new Date())).format('YYYY-MM-DD HH:mm:ss')}\n`; 
		baseStr = baseStr + formattedDateStr;

		// 函数名
		let funcNameStr =`-- @FuncName: ${functionName}\n`;
		baseStr = baseStr + funcNameStr;
		
		let index = 1;
		// 函数变量
		params.forEach(element => {
			if (element.length > 0) {
				baseStr = baseStr + `-- @Args${index}: ${element.replace(" ", "")}\n`;
				index++;
			}

		});
		baseStr = baseStr + '-- ************************************************************';

		snippetCompletion.insertText = new vscode.SnippetString(baseStr);
		snippetCompletion.documentation = new vscode.MarkdownString("输入 antt, 生成函数注释");

		return snippetCompletion
	}

	function createFileAnnotationCompletion(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
		const snippetCompletion = new vscode.CompletionItem('fantt');
		let baseStr = "-- ************************************************************\n";
		// 文件名
		let fileName = document.fileName
		const functionEndIndex = fileName.lastIndexOf('\\');
		fileName = fileName.substring(functionEndIndex + 1, fileName.length).replace(" ", "");

		let fileNameStr =`-- @File: ${fileName}\n`;
		baseStr = baseStr + fileNameStr;

		// 文件名
		let desStr =`-- @Summary: \n`;
		baseStr = baseStr + desStr;

		// 文件名
		let versionStr =`-- @Version: 1.0\n`;
		baseStr = baseStr + versionStr;

		// 作者
		let authorStr = "-- @Author: luogizz\n";
		baseStr = baseStr + authorStr;

		// 时间
		let formattedDateStr =`-- @Date: ${(moment(new Date())).format('YYYY-MM-DD HH:mm:ss')}\n`; 
		baseStr = baseStr + formattedDateStr;

		baseStr = baseStr + '-- ************************************************************';


		snippetCompletion.insertText = new vscode.SnippetString(baseStr);
		snippetCompletion.documentation = new vscode.MarkdownString("输入fantt, 生成文件注释");
		return snippetCompletion
	}

	let provider1 = vscode.languages.registerCompletionItemProvider(sel, {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			const snippetCompletion1 = createFuncAnnotationCompletion(document,position,token,context);
			const snippetCompletion2 = createFileAnnotationCompletion(document,position,token,context);

			return [
				snippetCompletion1,
				snippetCompletion2
			];
		}
	});


	context.subscriptions.push(provider1);
}
