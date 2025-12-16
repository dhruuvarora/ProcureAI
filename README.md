<img width="1536" height="1024" alt="ProcureAI" src="https://github.com/user-attachments/assets/14253148-3e4a-47c3-b9ab-96a48bc81985" />
# ProcureAI — AI-Powered Procurement & RFP Management System

ProcureAI is a full-stack procurement management system that digitizes and automates the **end-to-end Request for Proposal (RFP) lifecycle**, enabling organizations to manage vendors, collect proposals, and make data-driven decisions using AI.

The system is designed with a **backend-first, production-grade mindset**, focusing on correctness, business rule enforcement, safe data handling, and deterministic AI outputs.

---

## 🚩 Problem Statement

In traditional procurement workflows:

- RFPs are shared over emails and documents
- Vendor proposals arrive in unstructured formats
- Comparing multiple proposals is manual, slow, and error-prone
- Decision-making depends heavily on human interpretation
- There is no clear enforcement of procurement rules

As the number of vendors and proposals increases, **manual evaluation does not scale**.

---

## 💡 Solution Overview

ProcureAI solves this by providing:

- A structured system to manage procurement entities
- Controlled vendor participation through explicit mappings
- Safe handling of business-critical data
- AI-assisted proposal understanding and comparison
- Deterministic outputs suitable for real systems (not demos)

The platform ensures **process correctness first**, and then augments it with AI for decision support.

---

## 🧠 What ProcureAI Does

### 1. Structured Procurement Management
- Organizes procurement into clear entities such as categories, vendors, RFPs, and proposals
- Enforces strict relationships between these entities
- Prevents invalid or inconsistent states at the system level

### 2. Controlled Vendor Participation
- Vendors cannot submit proposals unless explicitly linked to an RFP
- Ensures only relevant and approved vendors participate in a procurement process

### 3. Proposal Ingestion from Unstructured Data
- Accepts proposal content as raw text (e.g. email bodies, documents)
- Stores original proposal data safely for traceability

### 4. AI-Driven Understanding & Evaluation
- Summarizes vendor proposals into structured insights
- Compares multiple proposals against the same RFP
- Recommends vendors based on objective criteria such as cost, delivery timelines, and constraints

### 5. Business Rule Enforcement
- Prevents deletion of entities that are actively in use
- Ensures referential integrity without relying on unsafe cascade deletes
- Uses proper failure semantics instead of silent errors

---

## 📦 Real-World Example

### Scenario: Laptop Procurement

An organization needs to procure **20 laptops with 16GB RAM**.

**Step 1 — RFP Creation**  
A procurement manager creates an RFP describing:
- Required quantity
- Specifications
- Budget constraints
- Expected delivery timeline

**Step 2 — Vendor Participation**  
Only vendors operating under the relevant category (e.g. IT Hardware) are explicitly mapped to this RFP.

**Step 3 — Proposal Submission**  
Vendors submit proposals in free-form text such as:

> “We can supply 20 laptops with 16GB RAM at a total cost of ₹47,000 per unit, delivery in 25 days.”

**Step 4 — AI Assistance**  
The system:
- Converts unstructured proposal text into structured summaries
- Compares all received proposals
- Highlights cost, delivery time, and trade-offs
- Recommends the most suitable vendor based on available data

The final decision remains with humans, but **AI drastically reduces evaluation effort**.

---

## 🏗 System Design Principles

- **Backend-driven architecture**  
  All business logic lives on the server. The client remains thin.

- **Explicit relationships over assumptions**  
  No implicit vendor access or cascade behaviors.

- **Safe delete semantics**  
  Data integrity is preserved at all times.

- **Deterministic AI usage**  
  AI is used as a decision-support layer, not a black box.

- **Production realism**  
  The system is designed to behave predictably under real constraints, not just ideal flows.

---

## 🧠 AI Philosophy

ProcureAI does not treat AI as a chat interface.

Instead:
- AI outputs are structured and predictable
- No markdown or ambiguous responses
- Designed for direct consumption by systems
- Focused on summarization and comparison, not creativity

This makes the AI layer suitable for **real enterprise workflows**.

---

## 🧪 Engineering Focus

- Strong emphasis on correctness and data safety
- Clear separation of responsibilities
- Real database-backed testing
- Error handling aligned with real API behavior
- Awareness of edge cases and failure scenarios

---

## 🎯 Who This Is For

- Procurement teams handling multiple vendors
- Organizations seeking structured decision-making
- Systems that need AI insights without sacrificing control
- Engineers interested in real-world backend design patterns

---

## 👨‍💻 Author

**Dhruv Arora**  
Backend Engineer  
Focused on Distributed Systems, Backend Architecture, and AI Integration

---

## 📌 Note

This project prioritizes **engineering quality and system design** over UI complexity.  
The goal is to demonstrate how real backend systems are built, constrained, and evolved — with AI used responsibly where it adds value.
