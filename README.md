# In-person proposals (for citizen engagement)

This project is a web application that allows users to record audio proposals, transcribe them, and submit them along with their details (name, email, photo). The application lets users manually edit the transcribed text, change its tone, and review the information before submission.

## Table of Contents

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Features](#features)
- [Usage](#usage)
- [Scripts](#scripts)
- [License](#license)

## Getting Started

To get started with this project, follow the instructions below.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/simonaszilinskas/in-person-proposals.git
   cd in-person-proposals
   ```

2. Install the dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open http://localhost:3000 in your browser to see the application.

## Dependencies

- React: Frontend library for building user interfaces
- Next.js: React framework for server-side rendering and static site generation
- Tailwind CSS: Utility-first CSS framework for styling
- lucide-react: Icon library for React
- next/font/google: Google Fonts for Next.js

## Features

- **Recording**: Start and stop audio recording using the device's microphone.
- **Transcription**: Send recorded audio to be transcribed into text.
- **Editing**: Allows users to manually edit the transcribed text and change its tone.
- **User Details**: Collect user details including name, email, and photo.
- **Review and Submit**: Review all details before submitting the proposal.
- **Restart**: Restart the process from the recording step.
- **Design**: Styled using Tailwind CSS with fonts from Google Fonts (Poppins, Libre Baskerville, Roboto Mono).

## Usage

### Recording a Proposal

1. Click the "Commencer l'enregistrement" button to start recording.
2. Click the "Envoyer l'idée" button to stop recording and send the audio for transcription.

### Editing the Proposal

1. Edit the transcribed text in the textarea.
2. Change the tone of the text using the provided buttons.

### Enter User Details

1. Enter your name and email address.
2. (Optional) Upload a photo.

### Review and Submit

1. Review all the details.
2. Edit the proposal text again if necessary.
3. Click "Envoyer la proposition" to submit.

### Restart

Click the restart button to reset the process from the recording step.

## Scripts

- `dev`: Runs the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.

To run a script, use:

```sh
npm run <script-name>
# or
yarn <script-name>
```

## Contributing

Contributions are welcome! Please create a pull request or open an issue if you have any suggestions or bug reports.

## License

This project is licensed under GNU General Public License (GPL) v3.0.
