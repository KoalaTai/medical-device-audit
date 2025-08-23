# Medical Device Audit Readiness Assessment

A comprehensive web application for evaluating ISO 13485 and 21 CFR 820 compliance readiness with automated artifact generation.

## 🎯 Overview

This tool provides medical device manufacturers with a structured assessment of their regulatory compliance readiness, generating professional audit preparation materials including gap analyses, CAPA plans, and interview preparation scripts.

## ✨ Features

- **20-Question Comprehensive Assessment** covering key regulatory requirements
- **Intelligent Scoring Engine** with critical gap detection and RAG classification
- **Automated Artifact Generation** creating professional audit preparation documents
- **Export Functionality** packaging results as downloadable ZIP files
- **CLI Interface** for programmatic assessment scoring
- **Professional UI** with progress tracking and detailed results visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd audit-readiness-assessment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📋 Assessment Process

### 1. Interactive Questionnaire
- 20 structured questions covering critical compliance areas
- Question types: Boolean (Yes/No), Multiple Choice, Slider (1-5), Text
- Real-time progress tracking
- Help text and regulatory references for each question

### 2. Intelligent Scoring
- **Weighted Assessment**: Questions weighted by regulatory importance
- **Critical Gap Detection**: Any critical requirement answered negatively caps score at ≤60%
- **RAG Classification**: 
  - 🟢 **Green (≥85%)**: Strong audit readiness
  - 🟡 **Amber (70-84%)**: Moderate readiness, focused improvements needed  
  - 🔴 **Red (<70%)**: Significant gaps requiring immediate attention

### 3. Results & Artifacts
- Comprehensive compliance gap analysis
- CAPA (Corrective and Preventive Action) plan template
- Role-based audit interview preparation scripts
- Exportable ZIP package with all deliverables

## 📊 Scoring Algorithm

The scoring engine implements the following logic:

1. **Base Scoring**: Weighted average of all responses (0-100 scale)
2. **Critical Hit Detection**: Critical questions answered negatively trigger score cap
3. **Gap Identification**: Responses below 70% threshold identified as gaps
4. **Priority Ranking**: Gaps ranked by impact (weight × deficit)

### Example Scoring Output:
```json
{
  "version": "0.1.0",
  "overall_score": 78,
  "status": "Amber",
  "critical_hit": false,
  "top_gaps": [
    {
      "question_id": "Q11",
      "clause_ref": "STA.820.250",
      "deficit": 5.0,
      "label": "Are statistical techniques used for process validation..."
    }
  ],
  "weights_summary": {
    "sum_weights": 143,
    "sum_obtained": 111.5
  },
  "timestamp": "2024-01-15T14:30:00Z",
  "engine_notes": "Standard scoring applied"
}
```

## 📁 Project Structure

```
src/
├── components/           # React UI components
│   ├── HomePage.tsx     # Landing page with feature overview
│   ├── QuestionnairePage.tsx  # Interactive assessment interface
│   └── ResultsPage.tsx  # Results display with artifact preview
├── lib/                 # Core business logic
│   ├── types.ts         # TypeScript interfaces
│   ├── questions.ts     # Assessment questions database
│   ├── scoring.ts       # Scoring engine implementation
│   ├── artifacts.ts     # Document generation logic
│   ├── export.ts        # ZIP export functionality
│   └── cli.ts           # Command-line interface utilities
├── tests/               # Unit tests
└── examples/            # Sample data and exports

data/
├── sample_answers.csv   # Example assessment responses
└── standards_map.yaml   # Regulatory standards mapping

examples/
└── sample_export_*.zip  # Example export packages
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Scoring algorithm accuracy
- Artifact generation functionality
- Edge cases and error handling
- CLI interface operation

### Sample Test Data

Use the provided sample data for testing:

```bash
# Sample responses for a mid-range assessment (Amber status)
cat data/sample_answers.csv
```

## 📤 Export Format

Assessment results are exported as ZIP packages containing:

```
deliverables/
├── gap_list.md              # Ranked compliance gaps with recommendations
├── capa_plan.md             # CAPA plan template with identified gaps
└── audit_interview_script.md # Role-based interview preparation guide

readiness.json               # Complete assessment results data
```

## 🎨 Screenshots

### Assessment Interface
![Assessment Interface](docs/screenshots/assessment.png)

### Results Dashboard  
![Results Dashboard](docs/screenshots/results.png)

### Generated Artifacts
![Generated Artifacts](docs/screenshots/artifacts.png)

## 🔧 CLI Usage

For programmatic usage or batch processing:

```bash
# Score assessment from CSV file
node -e "
  import('./src/lib/cli.js').then(cli => {
    const fs = require('fs');
    const csv = fs.readFileSync('data/sample_answers.csv', 'utf8');
    cli.runCLIAssessment(csv, true);
  });
"
```

## 📋 Assessment Categories

The tool covers these key compliance areas:

- **Quality Management System** (ISO 13485 / 21 CFR 820.30)
- **Management Responsibility** (21 CFR 820.20)
- **Document Control** (21 CFR 820.40)
- **Design Controls** (21 CFR 820.30)
- **Risk Management** (ISO 14971)
- **Purchasing Controls** (21 CFR 820.50)
- **CAPA System** (21 CFR 820.100)
- **Production Controls** (21 CFR 820.70)
- **Records Management** (21 CFR 820.184)
- **Post-Market Surveillance** (21 CFR 820.198)

## ⚖️ Legal Disclaimer

**IMPORTANT**: This assessment tool is provided for educational and planning purposes only. 

- ❌ **Not Legal Advice**: Results do not constitute legal or regulatory advice
- ❌ **Not Compliance Certification**: Does not certify regulatory compliance
- ❌ **Educational Use Only**: Intended for training and preparation activities
- ✅ **Professional Consultation Required**: Always consult qualified regulatory professionals for authoritative compliance guidance

The tool is based on publicly available regulatory guidance but should not replace professional regulatory consultation or official compliance audits.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical issues or feature requests, please open an issue on GitHub.

---

**Built with**: React, TypeScript, Tailwind CSS, Vite
**Assessment Standards**: ISO 13485:2016, 21 CFR Part 820