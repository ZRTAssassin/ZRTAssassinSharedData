toggle := 0
F8::
    if toggle = 0
    {
        Send, {Space down}
        toggle := 1
    }
    else
    {
        Send, {Space up}
        toggle := 0
    }
return