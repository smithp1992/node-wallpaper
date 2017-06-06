Dim oShell, fso, file, currentDir
Set oShell = WScript.CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get VBScript's file location (project directory)
Set file = fso.GetFile(Wscript.ScriptFullName)
currentDir = fso.GetParentFolderName(file)

' Go to project directory and execute npm run start
oShell.run "cmd.exe /c cd """ & currentDir & """ && npm run remove & PAUSE", 1
Set oShell = Nothing