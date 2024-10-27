toggle := 0

F7::
    if toggle = 0
    {
        Send, {1 down}
        toggle := 1
    }
    else
    {
        Send, {1 up}
        toggle := 0
    }
return