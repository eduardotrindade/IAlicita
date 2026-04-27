' Abre smartia-portal-offline.html no Microsoft Edge (se existir).
' Duplo clique neste arquivo. Nao precisa de Python nem Node.

Option Explicit

Dim fso, sh, scriptDir, htmlPath, edge

Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
htmlPath = scriptDir & "\smartia-portal-offline.html"

If Not fso.FileExists(htmlPath) Then
  MsgBox "Arquivo nao encontrado nesta pasta:" & vbCrLf & htmlPath, vbCritical, "SmartIA"
  WScript.Quit 1
End If

edge = sh.ExpandEnvironmentStrings("%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
If Not fso.FileExists(edge) Then
  edge = sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe")
End If

If fso.FileExists(edge) Then
  sh.Run Chr(34) & edge & Chr(34) & " " & Chr(34) & htmlPath & Chr(34), 1, False
Else
  ' Sem Edge: abre com o programa padrao do Windows
  sh.Run Chr(34) & htmlPath & Chr(34), 1, False
End If
