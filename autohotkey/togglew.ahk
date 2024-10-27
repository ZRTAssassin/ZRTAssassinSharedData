toggle := 0

F7::
    if toggle = 0
    {
        Send, {W down}
        toggle := 1
    }
    else
    {
        Send, {W up}
        toggle := 0
    }
return