# Medical Device Audit Readiness Assessment Tool

A comprehensive web application that evaluates medical device company readiness for regulatory audits through questionnaires, scoring algorithms, and gap analysis reporting.

**Experience Qualities**:
1. Professional - Clean, clinical interface that inspires confidence in regulatory compliance
2. Efficient - Streamlined questionnaire flow with clear progress indicators and immediate feedback
3. Authoritative - Evidence-based scoring with detailed regulatory clause references and actionable insights

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-page questionnaire workflow with state persistence, scoring algorithms, and document generation capabilities

## Essential Features

**Questionnaire System**
- Functionality: 25-question assessment covering ISO 13485/21 CFR 820 requirements with different question types
- Purpose: Systematically evaluate compliance across critical regulatory areas
- Trigger: User clicks "Start Assessment" from home page
- Progression: Home → Question 1/25 → Progress through all questions → Results page
- Success criteria: All questions answered, responses persist during session, validation prevents incomplete submissions

**Scoring Engine**
- Functionality: Calculates 0-100 readiness score with weighted questions and critical failure logic
- Purpose: Provide objective assessment with clear risk stratification
- Trigger: User completes final questionnaire question
- Progression: Final answer submitted → Score calculation → Risk band assignment (Red/Amber/Green) → Gap identification
- Success criteria: Score reflects weighted responses, critical failures cap score at 60, top 5 gaps identified with clause references

**Gap Analysis Report**
- Functionality: Generates prioritized list of compliance gaps with regulatory citations
- Purpose: Provide actionable roadmap for audit preparation
- Trigger: Score calculation completion
- Progression: Score computed → Gaps ranked by weighted deficit → Regulatory clauses mapped → Evidence suggestions provided
- Success criteria: Gaps ranked by impact, include clause references, suggest specific evidence types

**CAPA Planning Tool**
- Functionality: Generates structured CAPA plan template with 5-Whys analysis framework
- Purpose: Facilitate systematic corrective and preventive action planning
- Trigger: User views results page after scoring
- Progression: Results displayed → CAPA template generated → Structured format with Problem/Root Cause/Actions/Verification
- Success criteria: Template includes all identified gaps, 5-Whys methodology, owner/timeline fields

**Export System**
- Functionality: Downloads comprehensive assessment package as ZIP file
- Purpose: Provide shareable documentation for audit preparation teams
- Trigger: User clicks "Export Assessment" button on results page
- Progression: Export clicked → Package generation → ZIP download with all artifacts
- Success criteria: ZIP contains gap analysis, CAPA plan, interview script, and raw data JSON

## Edge Case Handling

- **Incomplete Sessions**: Auto-save progress to prevent data loss during long questionnaires
- **Invalid Responses**: Real-time validation with clear error messages for required fields
- **Browser Compatibility**: Graceful degradation for older browsers with core functionality maintained
- **Large Exports**: Progress indicators for ZIP generation with timeout handling
- **Data Persistence**: Session recovery after accidental page refresh or navigation

## Design Direction

The interface should evoke clinical precision and regulatory authority - clean, structured, and trustworthy like medical software used in hospitals and regulatory agencies, with generous whitespace and clear information hierarchy that reduces cognitive load during assessment completion.

## Color Selection

Complementary (opposite colors) - Using medical blue as primary with warm accent for critical alerts, creating professional healthcare aesthetic while ensuring accessibility.

- **Primary Color**: Medical Blue oklch(0.45 0.15 240) - Communicates healthcare professionalism and regulatory compliance
- **Secondary Colors**: Neutral Gray oklch(0.85 0.02 240) for backgrounds and Light Blue oklch(0.92 0.08 240) for cards
- **Accent Color**: Warm Orange oklch(0.65 0.18 45) for critical alerts and call-to-action elements
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark Gray oklch(0.25 0.02 240) - Ratio 12.6:1 ✓
  - Card (Light Gray oklch(0.95 0.02 240)): Dark Gray oklch(0.25 0.02 240) - Ratio 11.8:1 ✓
  - Primary (Medical Blue oklch(0.45 0.15 240)): White oklch(1 0 0) - Ratio 6.2:1 ✓
  - Accent (Warm Orange oklch(0.65 0.18 45)): White oklch(1 0 0) - Ratio 4.8:1 ✓

## Font Selection

Typography should convey clinical precision and regulatory authority using clean, highly legible sans-serif fonts that mirror professional medical and compliance documentation.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold 32px tight letter spacing
  - H2 (Section Headers): Inter Semibold 24px normal spacing
  - H3 (Question Numbers): Inter Medium 18px normal spacing
  - Body (Questions/Content): Inter Regular 16px relaxed line height
  - Labels (Form Elements): Inter Medium 14px tight spacing
  - Caption (Clause References): Inter Regular 12px normal spacing

## Animations

Subtle functionality-focused animations that reinforce progress and provide feedback without disrupting the clinical workflow atmosphere - primarily progress indicators and state transitions.

- **Purposeful Meaning**: Progress animations reinforce forward movement through assessment, subtle state changes provide confidence in system response
- **Hierarchy of Movement**: Question transitions and score calculations receive primary animation focus, secondary elements like tooltips use minimal motion

## Component Selection

- **Components**: Card for question containers, Progress for assessment advancement, Button with distinct primary/secondary variants, Input with validation states, Badge for risk levels, Tabs for results sections, Dialog for export confirmation
- **Customizations**: Custom progress ring for readiness score display, specialized question type components (YesNo, Select, TextArea), regulatory clause reference tooltips
- **States**: Buttons show loading states during score calculation, inputs provide real-time validation feedback, progress bar updates smoothly between questions
- **Icon Selection**: CheckCircle for completed questions, AlertTriangle for critical gaps, FileText for exports, ArrowRight for navigation, Info for help tooltips
- **Spacing**: Consistent 6-unit (24px) spacing between question blocks, 4-unit (16px) internal card padding, 2-unit (8px) form element spacing
- **Mobile**: Single-column layout with full-width cards, simplified navigation with floating action buttons, collapsible sections for results display