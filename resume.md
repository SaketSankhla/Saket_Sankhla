# Saket Sankhla
Jodhpur, Rajasthan, India | +91 7891093675 | saketsankh18@gmail.com | [LinkedIn](https://www.linkedin.com/in/saket-sankhla-4a193a277) | [GitHub](https://github.com/SaketSankhla)

## Technical Domain Specializations
* **Verification & RTL Design:** Constrained-Random Verification, SystemVerilog OOP Testbenches, SystemVerilog Assertions (SVA), Functional Coverage, Verilog, VHDL, AMBA APB/AHB bus protocols, RTL modeling.
* **EDA Tools & Methodologies:** Xilinx Vivado, Icarus Verilog, GTKWave, Yosys, OpenLane, clock domain crossing (CDC) analysis, static timing analysis (STA).
* **Embedded Hardware & HIL:** Hardware-in-the-Loop (HIL) testing, logic analyzers, digital storage oscilloscopes, ESP32, Arduino, Altium Designer (PCB Layout), I2C, SPI, UART.
* **Programming & Scripting:** C, C++ (Embedded), Python (automation & telemetry parsing), Assembly (8085/8086), Dart, JavaScript.

---

## Education
**Government Engineering College, Ajmer (GECA)** — *Ajmer, Rajasthan, India*  
*Bachelor of Technology (B.Tech) in Electronics & Communication Engineering* | Sept 2023 – June 2027 (Expected)  
* Relevant Coursework: Digital System Design, Linear Integrated Circuits, Computer Architecture, Optical Fiber Communication, Neural Networks & Fuzzy Logic.

**KL University** — *Guntur, Andhra Pradesh, India*  
*Bachelor of Technology (B.Tech) in Electronics & Communication Engineering* (Transferred) | July 2023 – Sept 2023  

---

## Experience
**Defence Research and Development Laboratory (DRDL) - DRDO** — *Jodhpur, India*  
*Summer Intern (Avionics & Control Electronics)* | May 2026 – Present  
* **HIL Diagnostics & Debugging:** Perform Hardware-in-the-Loop (HIL) board-level testing, tracking bus signal routing with logic analyzers and oscilloscopes to isolate and resolve timing anomalies.
* **Telemetry Interface Mapping:** Analyze avionics control loops, RF transceiver interfaces, and high-reliability defense communication lines to verify interface compatibility.
* **Technical Documentation:** Document system cabling configurations, pinout lists, and electrical power distribution schemas across telemetry sub-systems.

**IIT Roorkee Drone Hackathon** — *Roorkee, India*  
*Electronics & Avionics Lead* | 2026  
* **Avionics Power & Signal Integrity:** Designed noise-isolated Power Distribution Networks (PDN) and sensor traces for drone flight controllers under stringent layout constraints.
* **Control Loop Validation:** Optimized sensor polling registers and tuned PID firmware parameters in C++ to stabilize flight controllers under transient noise profiles.
* **Telemetry Scripting:** Created Python validation scripts to automatically parse telemetry logs, analyzing flight state transitions and diagnostic codes.

**Maven Silicon** — *Bengaluru, India*  
*VLSI Design & Verification Intern* | July 2025 – August 2025  
* **RTL Design:** Developed a synthesizable [AMBA APB-to-AHB bus bridge](https://github.com/SaketSankhla/APB-to-AHB-Bridge) in SystemVerilog, implementing pipeline controls and protocol conversion.
* **Constrained-Random Verification:** Constructed a SystemVerilog OOP testbench with Bus Functional Models (BFMs), constraint-based transaction generators, and scoreboards to automate verification.
* **Assertion-Based Verification (ABV):** Authored SystemVerilog Assertions (SVA) to verify interface handshake signals (e.g., HREADY, PENABLE) and state transition rules.
* **Waveform Analysis & Debugging:** Ran behavioral simulations in Icarus Verilog; analyzed waveforms and completed CDC timing analysis to identify and resolve timing violations.

**Bharat Sanchar Nigam Limited (BSNL)** — *Jodhpur, India*  
*Telecom Trainee* | June 2024  
* **Network Routing Analysis:** Inspected configuration maps of central telephone exchanges, optical transport systems, and GSM cellular switches to understand routing signals.

---

## Technical Projects
**[[Embedded DSP & ML] Electricity Theft Detector v2.0](https://github.com/SaketSankhla/smart_energy_meter)** | *ESP32, Python, C++, TensorFlow*  
* **DSP Firmware Development:** Programmed ESP32 firmware in C++ featuring True RMS sampling loops triggered by hardware interrupts to extract load signatures from ZMPT101B and SCT-013 sensors.
* **Transient Filtering & Debounce:** Coded a temporal debounce filter inside the analog acquisition thread to eliminate transient noise spikes, reducing false theft alerts by 40%.
* **Watchdog & Connectivity Loops:** Built auto-reconnect WiFi recovery routines and hardware watchdog timers to achieve 99.9% uptime for Google Sheets REST logging services.

**[[Embedded Control] Arduino JARVIS Desk Companion](https://github.com/SaketSankhla/Arduino-JARVIS-Desk-Robot)** | *Arduino, Embedded C, Sensors*  
* **Cooperative Non-Blocking Scheduler:** Engineered a cooperative task scheduler in Embedded C, executing non-blocking HC-SR04 telemetry reads and I2C LCD updates without raw delays.
* **Signal Noise Isolation:** Modeled and tested RC low-pass filters on analog sensor signal lines to isolate input bounce and stabilize trigger registers.

**[[ASIC/VLSI Design] Digital VLSI Library Blocks](https://github.com/SaketSankhla/Digital-VLSI-Projects)** | *Verilog, Icarus Verilog, GTKWave*  
* **Synthesizable RTL Blocks:** Modeled synthesizable Verilog modules for standard cell blocks including Full Adders, Decoders, and Multiplexers.
* **Functional Verification:** Constructed self-checking behavioral testbenches in Verilog; verified timing paths and traced logic transitions inside GTKWave.
