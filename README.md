# MIE Form Builder

**Note: This project is still in ongoing development and currently in its alpha version.**

Welcome to the MIE Form Builder repository! This project aims to provide a user-friendly and customizable form building tool that can be integrated into various applications, especially in the medical industry.

![image](https://github.com/user-attachments/assets/67b17ad4-2333-4988-b32b-b446e64692af)


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Export](#export)
- [Import](#import)
- [Demo](#demo)
- [Acknowledgments](#acknowledgments)

## Introduction

The MIE Form Builder is designed to simplify the process of creating and managing forms. Whether you need to collect patient information, feedback, or any other type of data, this tool allows you to build forms with ease and efficiency.

## Features

- **Drag and Drop Interface**: Easily add and arrange form elements.
- **Customizable Elements**: Create custom fields to fit your needs.
- **Import & Export**: of predefined JSON Structure
- **Clean FHIR Data** (WIP)
- **Clean User Oriented Interface**

## Installation

To get started with the MIE Form Builder, follow these steps:

1. **Clone the repository:**

```bash
   git clone https://github.com/lattln/mie-form-builder.git
```
2. **Navigate to the project directory:**
```bash
   cd mie-form-builder
```
3. **Install the dependencies:**
```bash
   npm install
```
## Usage

After installing the dependencies, you can start the development server by running:
```
npm start
```

This will launch the application, and you can access it in your web browser at `http://localhost:3000`.

## Export

The MIE Form Builder allows you to export the structure of your forms as JSON. This feature enables you to save the form configuration and load it later or use it in another application.

To export a form as JSON:

1. Build your form using the drag and drop interface.
2. Click the "Export" button.
3. The JSON structure of your form will be generated and available for download.

## Import

You can also import a JSON structure to load a pre-defined form configuration. This feature is useful for reusing form templates or loading forms saved from previous sessions.

To import a form from JSON:

1. Click the "Import" button.
2. Upload your JSON file.
3. The form builder will load the form configuration from the JSON and render it in the interface.

## Demo

You can see a live demo of the MIE Form Builder in action at [this link](https://lattln.github.io/mie-form-builder/).

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

I would like to extend my gratitude to MIE (Medical Informatic Engineering) for their support throughout this project. Special thanks to Doug, for his invaluable guidance.
