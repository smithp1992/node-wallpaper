dim fso: set fso = CreateObject("Scripting.FileSystemObject")
dim CurrentDirectory
CurrentDirectory = fso.GetParentFolderName(wscript.ScriptFullName)
dim file
file = fso.BuildPath(CurrentDirectory, "\resources\scripts\start.bat")

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & file & Chr(34), 0
Set WshShell = Nothing