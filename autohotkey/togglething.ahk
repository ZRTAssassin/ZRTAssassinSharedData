toggle := 0

F8::
    if toggle = 0
    {
        Send, {F down}
        toggle := 1
    }
    else
    {
        Send, {F up}
        toggle := 0
    }
return