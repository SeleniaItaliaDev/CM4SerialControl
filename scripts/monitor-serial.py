import serial

PORT = '/dev/cu.usbserial-11230'   # <-- il tuo
BAUD = 115200                      # <-- il tuo (perché così lo vedi giusto ora)

ser = serial.Serial(PORT, BAUD, timeout=1)

HEADER = b'\xFF\x00\x00\x00\x03'

print("In ascolto... (Ctrl+C per uscire)")

buf = b''

while True:
    chunk = ser.read(64)
    if not chunk:
        continue

    buf += chunk

    # finché nel buffer c'è un header, processa
    while True:
        idx = buf.find(HEADER)
        if idx == -1:
            # tenerci solo gli ultimi 4-5 byte per non far crescere troppo
            if len(buf) > 10:
                buf = buf[-10:]
            break

        # scarta tutto prima dell'header
        if idx > 0:
            buf = buf[idx:]

        # ora buf inizia con HEADER
        if len(buf) < len(HEADER) + 2:
            # non abbiamo ancora tipo + length
            break

        msg_type = buf[5]   # il byte dopo l'header
        msg_len  = buf[6]   # il byte dopo il type

        frame_total_len = len(HEADER) + 2 + msg_len + 1  # header + type + len + payload + cksum

        if len(buf) < frame_total_len:
            # aspetta altri byte
            break

        frame = buf[:frame_total_len]
        buf = buf[frame_total_len:]

        payload = frame[len(HEADER)+2:-1]  # togli header, type, len, e checksum finale
        cksum   = frame[-1]

        # print("---- FRAME ----")
        # print("HEX:", " ".join(f"{x:02X}" for x in frame))
        # print(f"Messaggio   : 0x{msg_type:02X} ({msg_type})")
        # print(f"Lunghezza   : {msg_len}")
        # print(f"Payload HEX : {' '.join(f'{x:02X}' for x in payload)}")
        # print(f"Checksum    : 0x{cksum:02X}")
        # qui puoi specializzare i casi:
        if msg_type == 0x21:
            # questo è "quello che mandi tu"
            # dal tuo esempio: FF 00 00 00 03 21 06 80 74 10 82 00 00 53
            # payload = 80 74 10 82 00 00
            if len(payload) == 6:
                mittente = payload[0]   # 0x80
                comando  = payload[1]   # 0x74
                p1       = payload[2]
                p2       = payload[3]
                p3       = payload[4]
                p4       = payload[5]
                print("  --> FRAME 0x21 decodificato:")
                print(f"      mittente : {mittente} (0x{mittente:02X})")
                print(f"      comando  : {comando}  (0x{comando:02X})")
                print(f"      p1       : {p1} (0x{p1:02X})")
                print(f"      p2       : {p2} (0x{p2:02X})")
                print(f"      p3       : {p3} (0x{p3:02X})")
                print(f"      p4       : {p4} (0x{p4:02X})")
                #checksum print(f"      checksum : 0x{cksum:02X}")
                # print(cksum)

        print()
