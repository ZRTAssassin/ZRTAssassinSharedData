toggle := 0
F8::
    toggle := !toggle  ; Toggle the value (switches between 1 and 0)
    if (toggle)
    {
        SetTimer, HoldSpace, 10  ; Start the timer to press space
    }
    else
    {
        SetTimer, HoldSpace, Off  ; Stop the timer
        Send, {Space up}
    }
return

HoldSpace:
    Send, {Space down}
return
