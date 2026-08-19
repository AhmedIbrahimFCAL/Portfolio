document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================================== */
    /* 01. THEME MANAGEMENT & CUSTOM CANVAS BACKGROUNDS                           */
    /* ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const canvas = document.getElementById('custom-particles');
    const ctx = canvas.getContext('2d');

    let bubblesArray = [];
    let currentTheme = 'gold'; // Default

    // Resize canvas to seamlessly fill the window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /* -------------------------------------------------------------------------- */
    /* FLOATING BUBBLES CLASS (Handles both Gold and Cyan)                        */
    /* -------------------------------------------------------------------------- */
    class Bubble {
        constructor(theme) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 6 + 2; // Bubble size

            // Gently drifting upwards
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = (Math.random() * 0.3 + 0.1) * -1;

            // Assign colors based on the current theme
            if (theme === 'galaxy') {
                const blueColors = ['#06B6D4', '#00FFFF', '#0284C7', '#22D3EE'];
                this.color = blueColors[Math.floor(Math.random() * blueColors.length)];
            } else {
                const goldColors = ['#B8860B', '#FFD700', '#b68d2c', '#e0c168'];
                this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
            }

            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Loop back to the bottom when they float off the top
            if (this.y < 0 - this.size) {
                this.y = canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = this.alpha;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }

    /* -------------------------------------------------------------------------- */
    /* CORE ANIMATION CONTROLLER                                                  */
    /* -------------------------------------------------------------------------- */
    function initBackground(theme) {
        currentTheme = theme;
        bubblesArray = [];

        // Spawn 40 bubbles regardless of the theme
        for (let i = 0; i < 40; i++) {
            bubblesArray.push(new Bubble(theme));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < bubblesArray.length; i++) {
            bubblesArray[i].update();
            bubblesArray[i].draw();
        }

        requestAnimationFrame(animate);
    }

    // --- Theme Toggle Logic ---
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.icon');
        const themeTitle = themeToggle.querySelector('.title');
        const icon = document.querySelector('#icon');
        // Check memory on load
        if (localStorage.getItem('theme') === 'galaxy') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeTitle.textContent = 'Light Mode';
            icon.href = "Images/Me/nightIcon.png"
            initBackground('galaxy');
        } else {
            initBackground('gold');
        }

        // Start the engine
        animate();

        // Toggle click listener
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'galaxy');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                themeTitle.textContent = 'Light Mode';
                icon.href = "Images/Me/nightIcon.png"
                initBackground('galaxy');
            } else {
                localStorage.setItem('theme', 'gold');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                themeTitle.textContent = 'Night Mode';
                icon.href = "Images/Me/lightIcon.png"
                initBackground('gold');
            }
        });
    }


    /* ========================================================================== */
    /* 02. NAVIGATION & SECTION SWITCHING                                         */
    /* ========================================================================== */
    const navItems = document.querySelectorAll('.navigation ul li.list');
    const sections = document.querySelectorAll('main > section');
    const aboutSection = document.getElementById('About_Me');
    const skillsSection = document.getElementsByClassName('Skills')[0];

    // Initialize default active section
    sections.forEach(sec => sec.classList.remove('active-section'));
    if (aboutSection) aboutSection.classList.add('active-section');
    if (skillsSection) skillsSection.classList.add('active-section');

    // Handle clicks on the sidebar
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('theme-btn-container')) return;
            e.preventDefault();

            // 1. Update UI Active State
            navItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');

            // 2. Hide all sections and force animation reset
            sections.forEach(sec => {
                sec.classList.remove('active-section');
                void sec.offsetWidth; // Force browser reflow to restart animation
            });

            // 3. Show Target Section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.classList.add('active-section');

                // Special case: If About Me is active, also trigger Skills
                if (targetSection === aboutSection && skillsSection) {
                    skillsSection.classList.add('active-section');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // 4. Save to LocalStorage so it remembers on refresh
            if (targetId) {
                localStorage.setItem('savedPortfolioSection', targetId);
            }
        });
    });

    // Check LocalStorage on Page Load to restore last visited section
    const activeSectionMemory = localStorage.getItem('savedPortfolioSection');
    if (activeSectionMemory) {
        const targetLink = document.querySelector(`.list[data-target="${activeSectionMemory}"]`);
        if (targetLink) {
            targetLink.click(); // Programmatically clicks the link to trigger the logic above
        }
    }

    /* ========================================================================== */
    /* 03. PROJECTS JOURNEY MAP & MODAL                                           */
    /* ========================================================================== */
    const projects = [
        {
            title: "VaultNet",
            image: "Images/Projects/VaultNet.webp",
            description: `  <h4>&#x1F4B5; Customer Churn Prediction</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> VaultNet is a highly optimized, end-to-end machine learning pipeline capable of predicting which customers are at risk of leaving the bank. By accurately identifying flight risks, banks can proactively allocate retention budgets and drastically reduce lost lifetime revenue.</p>
                            
                            <h4>&#x1F6E0;&#xFE0F; Pipeline &amp; Engineering</h4>
                            <ul>
                              <li>Categorical Encoding: Ordinal Encoding and One-Hot Encoding to avoid dummy variable traps.</li>
                              <li>Feature Scaling: Standardized continuous financial metrics for model stability.</li>
                              <li>Train/Test Split: Stratified split to preserve the extreme 80:20 class imbalance.</li>
                            </ul>
                            
                            <h4>&#x1F9E0; Modeling Strategy</h4>
                            <ul>
                              <li>XGBoost: Tuned with strict regularization to aggressively hunt churners.</li>
                              <li>Random Forest: Configured with class weights to act as a stable, high-precision anchor.</li>
                              <li>Voting Ensemble: Averages the probability distributions of both models to smooth out false positives.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/VaultNet"
        },
        {
            title: "FraudShield",
            image: "Images/Projects/FraudShield.webp",
            description: `  <h4>&#x1F6E1;&#xFE0F; Fraudulent Transaction Detector</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> FraudShield is a production-grade machine learning system designed to detect fraudulent credit card transactions with high precision and recall. It implements a Stacking Ensemble optimized on a custom 1:60 sampling ratio to catch fraud effectively without overwhelming the system with false alarms.</p>
                            
                            <h4>&#x1F9E0; The Challenge</h4>
                            <ul>
                              <li>Handles extreme data imbalance (only 0.172% fraud cases in over 284,000 transactions).</li>
                              <li>Optimized to maximize the F2-Score, prioritizing catching fraud while maintaining usable Precision.</li>
                            </ul>
                            
                            <h4>&#x1F6E0;&#xFE0F; Solution Architecture</h4>
                            <ul>
                              <li>Advanced Sampling: 1:60 Ratio using BorderlineSMOTE and RandomUnderSampler.</li>
                              <li>The "Tri-Force" Stack: Combines Random Forest, XGBoost, and LightGBM.</li>
                              <li>Meta-Learner: Uses Logistic Regression to aggregate the predictions of the base models.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/FraudShield"
        },
        {
            title: "LeafLens",
            image: "Images/Projects/LeafLens.webp",
            description: `  <h4>&#x1F33F; Plant Disease Diagnostics</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> LeafLens is an advanced computer vision application designed to diagnose plant diseases from leaf images. Unlike standard classifiers, this project features a unique Multi-Model Ensemble, allowing users to switch between a fine-tuned Deep Learning model and custom-built statistical/ML implementations.</p>
                            
                            <h4>&#x1F9E0; The Intelligence Cores</h4>
                            <ul>
                              <li>The Specialist (PyTorch EfficientNet): A state-of-the-art Deep Learning CNN trained on over 50,000 images for maximum accuracy.</li>
                              <li>The Pattern Seeker: A custom-built Multi-Layer Perceptron (MLP) built from scratch in NumPy for lightweight inference.</li>
                              <li>The Statistician: A Gaussian Mixture Model (GMM) implemented from scratch that calculates statistical probabilities of diseases.</li>
                            </ul>
                            
                            <h4>&#x1F4DA; Supported Crops</h4>
                            <ul>
                              <li>Diagnoses 38 different conditions across 14 crops.</li>
                              <li>Supports Apple, Cherry, Corn, Grape, Potato, Tomato, Strawberry, and more.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/LeafLens"
        },
        {
            title: "Echo",
            image: "Images/Projects/Echo.webp",
            description: `  <h4>&#x1F4BB; Custom Command Line Interface</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> Echo is a custom, fully functional Command Line Interface built in Java. It features a modern, Matrix-style graphical terminal built with JavaFX and RichTextFX, providing a seamless interactive experience with standard Unix/Linux command emulation.</p>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Interactive GUI with full mouse interaction, selection, and scrolling.</li>
                              <li>Command Redirection (&gt; to overwrite, &gt;&gt; to append) with intelligent collision handling.</li>
                              <li>Smart Parsing for handling arguments enclosed in quotes.</li>
                              <li>Read-only history with an editable input line to mimic real terminal behavior.</li>
                            </ul>
                            
                            <h4>&#x1F4BE; Supported Commands</h4>
                            <ul>
                              <li>Directory &amp; Navigation: pwd, cd, ls, tree</li>
                              <li>File &amp; Folder Management: mkdir, rmdir, touch, cp, mv, rm, find, zip, unzip</li>
                              <li>Text Processing: cat, wc, grep, head, tail, sort, uniq, diff, echo, stat</li>
                              <li>System Commands: clear, history, date, whoami, help, exit</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Echo"
        },
        {
            title: "ALU",
            image: "Images/Projects/ALU.webp",
            description: `  <h4>&#x26A1; 8-Bit Structural ALU</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> StructuLogic is a digital logic project that implements a fully functional 8-bit Arithmetic Logic Unit (ALU) using pure Structural Modeling in Verilog. The design follows a bottom-up hardware architecture approach, building complex computation units strictly from primitive logic gates without using behavioral operators.</p>
                            
                            <h4>&#x2728; Key Features</h4>
                            <ul>
                              <li>Executes 12 Distinct Operations including arithmetic, logic, shifts, and rotations.</li>
                              <li>Real-time Status Flag Generation for Zero, Negative, and Overflow states.</li>
                              <li>Strict Hierarchical Design building from gates to adders/muxes to functional units.</li>
                              <li>Self-Checking Testbench that automatically verifies correctness against a golden behavioral reference.</li>
                            </ul>
                            
                            <h4>&#x1F527; Supported Operations</h4>
                            <ul>
                              <li>Arithmetic: ADD, SUB, INC, SEQ</li>
                              <li>Logic: AND, OR, NAND, NOT</li>
                              <li>Shift &amp; Rotate: ASL, ASR, ROL, ROR</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/StructuLogic"
        },
        {
            title: "Airox",
            image: "Images/Projects/Airox.webp",
            description: `  <h4>&#x1F32C;&#xFE0F; Real-Time Air Quality Prediction</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A Machine Learning project that predicts air quality categories (Good, Moderate, Poor) in real-time using a CatBoost Classifier. This project demonstrates a complete end-to-end MLOps workflow — from robust data cleaning and modeling to a stylish Streamlit deployment.</p>
                            
                            <h4>&#x2728; Key Features</h4>
                            <ul>
                              <li>Analyzes crucial inputs like pollutant concentrations, meteorological factors, and industrial proximity.</li>
                              <li>Robust data cleaning with handling for impossible readings and outlier normalization using RobustScaler.</li>
                              <li>Achieves 99% accuracy and a 1.00 ROC AUC score using CatBoost.</li>
                              <li>Deployed via a sleek, interactive Streamlit dashboard.</li>
                            </ul>
                            
                            <h4>&#x1F52C; EDA &amp; Analysis</h4>
                            <ul>
                              <li>In-depth Correlation Matrices and Feature-to-Target relationship tracking.</li>
                              <li>Distribution visualizations using Violin Plots.</li>
                              <li>Error Analysis using Confusion Matrices and ROC-AUC curves.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/AIROX"
        },
        {
            title: "EstimaHome",
            image: "Images/Projects/EstimaHome.webp",
            description: `  <h4>&#x1F3E0; House Price Predictor</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A Machine Learning project that predicts house prices based on various property features using an XGBoost Regressor. This project demonstrates a full end-to-end data science workflow from preprocessing and feature engineering to model evaluation and saving.</p>
                            
                            <h4>&#x2728; Key Features</h4>
                            <ul>
                              <li>Analyzes important features such as location attributes, year built/renovated, property size, and house age.</li>
                              <li>Assists real estate analysts, developers, or home buyers in understanding market trends and value estimation.</li>
                            </ul>
                            
                            <h4>&#x2699;&#xFE0F; Project Workflow</h4>
                            <ul>
                              <li>Data Preparation: Handling null values, duplicates, and feature engineering.</li>
                              <li>Exploratory Data Analysis: Correlation maps, histograms, boxplots, and scatter plots.</li>
                              <li>Model Building: Trained and fine-tuned an XGBoost Regressor evaluated using R-squared, MAE, and RMSE.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/EstimaHome"
        },
        {
            title: "The Unsinkable Ship",
            image: "Images/Projects/Titanic.webp",
            description: `  <h4>&#x1F6A2; Passenger Survival Predictor</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A machine learning project built on the famous Titanic dataset, using ensemble methods to predict passenger survival. Inspired by the tragedy of the Titanic, this project explores advanced feature engineering, model tuning, and ensembling to create an unsinkable predictor.</p>
                            
                            <h4>&#x1F6E0;&#xFE0F; Features Engineered</h4>
                            <ul>
                              <li>Title extraction from passenger names.</li>
                              <li>Fare binning to group socioeconomic classes.</li>
                              <li>Family size feature creation.</li>
                              <li>Age categories (child, teen, adult, senior).</li>
                            </ul>
                            
                            <h4>&#x1F9E0; Model Architecture</h4>
                            <ul>
                              <li>GradientBoostingClassifier for boosting power.</li>
                              <li>XGBClassifier with GPU acceleration for optimization.</li>
                              <li>Soft Voting Ensemble combining both models with a weighted ratio for peak accuracy.</li>
                              <li>Achieved robust test accuracy (~80.5%) using comprehensive cross-validation.</li>
                            </ul>`,
            link: "https://www.kaggle.com/code/youssefamgadelkhatib/the-unsinkable-ship"
        },
        {
            title: "OncoVision",
            image: "Images/Projects/OncoVision.webp",
            description: `  <h4>&#x1F9E0; OncoVision</h4>
                            <p>OncoVision is a deep learning project for brain tumor MRI classification using Convolutional Neural Networks (CNNs).  
                            It focuses on detecting and classifying brain tumors into categories such as <strong>Glioma, Meningioma, Pituitary,</strong> and <strong>No Tumor</strong>.  
                            The project covers data preprocessing, augmentation, custom CNN architecture, model training with checkpoints, and evaluation through metrics and visualizations.</p>
                            
                            <h4>&#x1F4CC; Features</h4>
                            
                            <h5>&#x1F5C3;&#xFE0F; Organized Workflow</h5>
                            <ul>
                              <li>Clean and structured Jupyter Notebook with section dividers and icons for better readability</li>
                            </ul>
                            
                            <h5>&#x1F5BC;&#xFE0F; Data Augmentation</h5>
                            <ul>
                              <li>Random flips, rotations, zooms, and contrast adjustments to improve generalization</li>
                            </ul>
                            
                            <h5>&#x1F3D7;&#xFE0F; Model Design</h5>
                            <ul>
                              <li>Custom CNN architecture tailored specifically for MRI brain image classification</li>
                              <li>Checkpointing with dual metrics - saves best model based on validation accuracy &amp; loss</li>
                            </ul>
                            
                            <h5>&#x1F4CA; Evaluation &amp; Results</h5>
                            <ul>
                              <li>Accuracy and loss learning curves</li>
                              <li>Confusion matrix for class-wise performance</li>
                              <li>Classification report (precision, recall, F1-score)</li>
                              <li>Sample predictions with visualizations</li>
                              <li>Achieved <strong>99.3% test accuracy</strong> on unseen MRI scans</li>
                            </ul>
                            
                            <h5>&#x1F4C2; Dataset</h5>
                            <p>This project uses the <strong>Brain Tumor MRI Dataset</strong> available on Kaggle, containing four classes:</p>
                            <ul>
                              <li>&#x1F9E9; Glioma</li>
                              <li>&#x1F9E9; Meningioma</li>
                              <li>&#x1F9E9; Pituitary</li>
                              <li>&#x274C; No Tumor</li>
                            </ul>
                            
                            <h5>&#x1F6E0;&#xFE0F; Tech Stack</h5>
                            <ul>
                              <li><strong>Language:</strong> Python 3.9+</li>
                              <li><strong>Deep Learning:</strong> TensorFlow / Keras</li>
                              <li><strong>Data Handling:</strong> NumPy, Pandas</li>
                              <li><strong>Evaluation:</strong> scikit-learn</li>
                              <li><strong>Visualization:</strong> Matplotlib, Seaborn</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/OncoVision"
        },
        {
            title: "Click & Cook",
            image: "Images/Projects/Click & Cook.webp",
            description: `  <h4>&#x1F373; Click &amp; Cook</h4>
                            <p>Click &amp; Cook is a user-friendly recipe finder website that connects food lovers! Users can browse and search for recipes, follow step-by-step instructions, leave reviews, and manage favorite dishes. Admins have full control over the recipe database, making it easy to manage and curate recipe content.</p>
                            
                            <h4>&#x1F4CC; Features</h4>
                            
                            <h5>&#x1F465; User Types</h5>
                            <ul>
                              <li><strong>Admin</strong></li>
                              <li><strong>Regular User</strong></li>
                              <li>Users can select their type during the signup process.</li>
                            </ul>
                            
                            <h5>&#x1F510; Authentication</h5>
                            <ul>
                              <li>Sign up with username, email, password, and user type (admin or user)</li>
                              <li>Secure login and signup system with email confirmation through code sending</li>
                            </ul>
                            
                            <h5>&#x1F468;&#x200D;&#x1F373; Admin Capabilities</h5>
                            <ul>
                              <li>&#x2705; Sign up &amp; login</li>
                              <li>&#x2795; Add new recipes (with course category, multiple ingredients, and detailed description)</li>
                              <li>&#x1F4DD; Edit any existing recipe</li>
                              <li>&#x274C; Delete recipes or reviews</li>
                              <li>&#x1F4C3; View list of all recipes</li>
                            </ul>
                            
                            <h5>&#x1F9D1;&#x200D;&#x1F373; User Capabilities</h5>
                            <ul>
                              <li>&#x2705; Sign up &amp; login</li>
                              <li>&#x1F50D; Search recipes by name or ingredients or mood</li>
                              <li>&#x1F4C3; View all available recipes</li>
                              <li>&#x1F4D6; View full recipe details with instructions</li>
                              <li>&#x2764;&#xFE0F; Add recipes to personal favorites list</li>
                              <li>&#x2B50; Leave reviews (rating + text) on recipes</li>
                              <li>&#x1F4CB; View their own favorites list</li>
                              <li>&#x1F5BC;&#xFE0F; Edit profile and upload a profile picture</li>
                            </ul>
                            
                            <h5>&#x1F311;&#x1F315; Dark/Light Mode Toggle</h5>
                            <p>Users can easily switch between light and dark themes using a button on the site.  
                            The mode is automatically saved, so your preferred mode stays active even after refreshing or returning later.  
                            The logo and favicon also adapt to match the selected theme for a consistent and modern experience.</p>
                            
                            <h5>&#x1F6A2; Navigation</h5>
                            <p>A clean, consistent navigation bar is available across all pages for easy site navigation.</p>
                            
                            <h5>&#x1F6E0;&#xFE0F; Tech Stack</h5>
                            <ul>
                              <li><strong>Frontend:</strong> HTML, CSS, JavaScript</li>
                              <li><strong>Backend:</strong> Django</li>
                              <li><strong>Database:</strong> SQLite3</li>
                            </ul>`,
            link: "https://clickandcook.pythonanywhere.com"
        },
        {
            title: "ERQ",
            image: "Images/Projects/ERQ.webp",
            description: `  <h4>&#x1F691; Emergency Room Priority System</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A C++ console application that simulates an Emergency Room using a Max Heap to prioritize patient treatment based on severity and arrival time. The system allows hospital staff to manage patients, update severities, track treatment history, and save/load data across sessions.</p>
                            
                            <h4>&#x1F4CB; Features</h4>
                            <ul>
                              <li>&#x2705; MaxHeap-based Priority Queue for patient management</li>
                              <li>&#x2795; Insert new patients</li>
                              <li>&#x26A0;&#xFE0F; Automatically prioritize patients by severity (higher severity first)</li>
                              <li>&#x23F1;&#xFE0F; Tiebreaker logic: earlier arrivals treated first in case of equal severity</li>
                              <li>&#x1F441;&#xFE0F; View next patient to treat (peek)</li>
                              <li>&#x1F6A8; Treat patient (extractMax)</li>
                              <li>&#x270F;&#xFE0F; Update patient severity</li>
                              <li>&#x1F50D; Find patient details</li>
                              <li>&#x274C; Remove patient from queue</li>
                              <li>&#x1F4CA; Calculate average severity</li>
                              <li>&#x1F3E5; Show overall emergency status (Critical, Urgent, Moderate, Low)</li>
                              <li>&#x1F4BE; Save patient queue to history file</li>
                              <li>&#x1F4C2; Load patient data from history file</li>
                              <li>&#x1F4DD; Treatment log tracking</li>
                              <li>&#x1F9EA; Supports loading batch test cases</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/ERQ"
        },
        {
            title: "SortGenius",
            image: "Images/Projects/SortGenius.webp",
            description: `  <h4>&#x1F4D6; Overview</h4>
                            <p>This C++ application allows users to input a dataset, ensuring all elements are of the same type (int, double, or string). Users can then choose from various sorting algorithms to sort the dataset. Additionally, users can run pre-defined test cases from a file.</p>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>&#x2705; <strong>Dataset Validation:</strong> Ensures all elements are of the same type before sorting.</li>
                              <li>&#x1F522; <strong>Multiple Sorting Algorithms:</strong> Choose from a variety of sorting techniques.</li>
                              <li>&#x1F4C2; <strong>Predefined Test Cases:</strong> Run test cases from a file for benchmarking.</li>
                              <li>&#x1F4CA; <strong>Performance Comparison:</strong> Analyze the efficiency of different sorting methods.</li>
                            </ul>
                            
                            <h4>&#x1F680; Supported Sorting Algorithms</h4>
                            <ol>
                              <li>Insertion Sort</li>
                              <li>Selection Sort</li>
                              <li>Bubble Sort</li>
                              <li>Shell Sort</li>
                              <li>Merge Sort</li>
                              <li>Quick Sort</li>
                              <li>Count Sort</li>
                              <li>Radix Sort</li>
                              <li>Bucket Sort</li>
                            </ol>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/SortGenius"
        },
        {
            title: "Ramadan-Gather",
            image: "Images/Projects/Ramadan-Gather.webp",
            description: `  <h4>&#x1F37D;&#xFE0F; Iftar Manager System</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> The Iftar Manager System is a C++ based application that helps manage Iftar invitations efficiently. It stores guest information, displays invitations, allows updates to the guest list, sends email reminders, stores database on a file, and sorts guests by invitation date.</p>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Store Guest Information - Maintain a record of invited guests, including name, contact details, and invitation date.</li>
                              <li>Display Invitations - Show a list of all guests invited for Iftar.</li>
                              <li>Update Guest List - Modify the guest list by adding or removing guests.</li>
                              <li>Send Reminder Messages - Notify guests via email about their invitation on a specific date.</li>
                              <li>Sort Guests by Date - Sort the guest list based on their invitation date.</li>
                              <li>Store Database on a file - Allow user to store Database in a file.</li>
                              <li>Load Database - Allow user to load Database from a file.</li>
                            </ul>
                            
                            <h4>&#x1F680; Test Cases</h4>
                            <ul>
                              <li>Test adding a guest successfully.</li>
                              <li>Test displaying the guest list correctly.</li>
                              <li>Test updating the invitation date.</li>
                              <li>Test sending real-life email reminders correctly.</li>
                              <li>Test sorting guests by date accurately.</li>
                              <li>Test writing Database to file successfully.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Ramadan-Gather"
        },
        {
            title: "DriveFlow",
            image: "Images/Projects/DriveFlow.webp",
            description: `  <h4>&#x1F698; Car Dealership Management System</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> The Car Dealership Management System is a Java-based application designed to manage a car dealership's inventory, purchases, and rentals. It provides a comprehensive, menu-driven interface for users to interact with the system, allowing them to perform various operations such as adding, updating, removing, and displaying details about cars, purchases, and rentals. This program is ideal for managing a car dealership's day-to-day operations efficiently.</p>
                            
                            <h4>&#x2728; Key Features</h4>
                            <ul>
                              <li><strong>Car Management:</strong> Add, update, remove, and display car details including model, color, make, year, price, and insurance information.</li>
                              <li><strong>Purchase Management:</strong> Record, update, cancel, and display car purchases along with customer details and payment methods.</li>
                              <li><strong>Rental Management:</strong> Record, update, and cancel rentals, tracking rental start/end dates and calculating total costs.</li>
                              <li><strong>System Operations:</strong> Save and load data to/from a file, calculate total dealership earnings, and view comprehensive system summaries.</li>
                              <li><strong>Input Validation:</strong> Ensures valid inputs for dates, prices, checks for duplicate IDs, and prevents invalid rental date ranges.</li>
                              <li><strong>Insurance Management:</strong> Track associated insurance details like provider name, policy number, and expiry date.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/DriveFlow"
        },
        {
            title: "Tic-Tac Domination",
            image: "Images/Projects/TicTac.webp",
            description: `  <h4>&#x1F3B2; Board Games</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> This project provides a C++ console-based application for managing and playing various board games with multiple types of players, including human players, random computer players, and AI-driven smart players. The project features include a game manager, board representation, and player management to facilitate smooth gameplay across different board game variants along with input validation.</p>
                            
                            <h4>&#x1F3AE; Supported Games</h4>
                            <ol>
                              <li><strong>Pyramid Tic-Tac-Toe:</strong> Pyramid-shaped board (5-3-1 layout). Players aim to get three in a row vertically, horizontally, or diagonally.</li>
                              <li><strong>Four-in-a-Row:</strong> 7x6 grid where players drop Xs and Os from the bottom up to get four in a row.</li>
                              <li><strong>5x5 Tic-Tac-Toe:</strong> 5x5 board; the winner is the player with the most three-in-a-row sequences.</li>
                              <li><strong>Word Tic-Tac-Toe:</strong> 3x3 board using letters to form valid words. First to form a word wins.</li>
                              <li><strong>Numerical Tic-Tac-Toe:</strong> 3x3 board with numbers; odd numbers for Player 1, even for Player 2. Win by summing to 15.</li>
                              <li><strong>Misere Tic-Tac-Toe:</strong> 3x3 board where the first player to get three in a row loses.</li>
                              <li><strong>Ultimate Tic-Tac-Toe:</strong> 3x3 grid of Tic-Tac-Toe boards. Win three smaller boards in a row to win the game.</li>
                              <li><strong>SUS:</strong> 3x3 board where players form the sequence 'S-U-S' to score. Most sequences wins.</li>
                            </ol>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Game Manager: Manages game flow and turns.</li>
                              <li>Board Representation: Supports various board sizes and rules.</li>
                              <li>Human Players: Allows user input for moves.</li>
                              <li>Random Computer Players: Makes random legal moves.</li>
                              <li>AI Smart Players: Uses algorithms to make strategic moves.</li>
                              <li>Expandable: Easily add new board games using the existing framework.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Tic-Tac-Domination"
        },
        {
            title: "Vole Machine",
            image: "Images/Projects/Vole Machine.webp",
            description: `  <h4>&#x1F4BB; Vole Machine Simulator</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> The Vole Machine Simulator is a virtual representation of a Vole Machine using C++, a simple computing system that executes instructions using a simulated CPU, RAM, and registers. This project provides an environment for executing Vole Machine instructions, manipulating memory, and simulating computational processes.</p>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Instruction Execution: Implements Vole Machine instruction set.</li>
                              <li>Memory Management: 16x16 RAM matrix for storing data.</li>
                              <li>Registers: 16 registers for temporary storage and calculations.</li>
                              <li>CPU Simulation: Fetch-Decode-Execute cycle for running instructions.</li>
                            </ul>
                            
                            <h4>&#x1F4DC; Supported Instructions</h4>
                            <ul>
                              <li><strong>LOAD / STORE:</strong> Load values from memory to registers, and vice versa.</li>
                              <li><strong>Arithmetic:</strong> ADD, SUB, MUL, DIV, MOD.</li>
                              <li><strong>Bitwise Logic:</strong> AND, OR, XOR, NOT, SHL, SHR.</li>
                              <li><strong>Control Flow:</strong> JMP, JE, JNE, JG, JL, JGE, JLE.</li>
                              <li><strong>Stack Operations:</strong> PUSH, POP, CALL, RET, HLT.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Vole-Machine"
        },
        {
            title: "Visual Vortex",
            image: "Images/Projects/Visual Vortex.webp",
            description: `  <h4>&#x1F300; Visual Vortex</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> Visual Vortex is a feature-rich GUI-based Photoshop application built using Qt Creator C++. It offers a vast selection of 27 different filters, advanced image editing functionalities, and an intuitive user experience for seamless photo manipulation.</p>
                            
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Apply 27 Different Filters - A diverse set of filters categorized into four sections.</li>
                              <li>Clear Filters - Remove all applied filters and restore the original image.</li>
                              <li>Change Current Image - Load a new image at any time.</li>
                              <li>Undo &amp; Redo - Step backward or forward through your edits.</li>
                              <li>Save &amp; Load Images - Store your edited images for later use.</li>
                              <li>Light &amp; Dark Mode - Switch between two different UI themes.</li>
                              <li>Image Info - View detailed properties of the current image.</li>
                              <li>Multiple Filters at Once - Apply multiple filters simultaneously.</li>
                              <li>Hide Program UI - Display only the image while editing.</li>
                              <li>Show Original Image - View the image without any applied filters.</li>
                            </ul>
                            
                            <h4>&#x1F680; Filter Categories</h4>
                            <ul>
                              <li>&#x1F3A8; Colours (9 Filters): Invert Image, TV Effect, Black &amp; White, Sunny Effect, Oil Painting, Infrared, Lighten/Darken, Purple Tint, Grayscale</li>
                              <li>&#x1F5BC;&#xFE0F; Frames (6 Filters): Rotate Frame, Rotate Image, Egg Shape, Ball Effect, Apply Frames, Heart Frame</li>
                              <li>&#x270F;&#xFE0F; Editing (6 Filters): Crop, Edge Detection, Merge Images, Blur, Resize, Flip</li>
                              <li>&#x1F6E0;&#xFE0F; Miscellaneous (5 Filters): Wave Effect, Center Light, Rain Drop, Skew, Pixelate</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Visual-Vortex"
        },
        {
            title: "Fractify",
            image: "Images/Projects/Fractify.webp",
            description: `  <h4>&#x1F522; Fraction Calculator</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A calculator that can add, subtract, multiply, and divide normal integers and fractions (positive or negative) using C++.</p>
                            
                            <h4>&#x1F4D0; Operations</h4>
                            <ul>
                              <li>Subtraction</li>
                              <li>Addition</li>
                              <li>Multiplication</li>
                              <li>Division</li>
                            </ul>
                            
                            <h4>&#x2728; Program Features</h4>
                            <ul>
                              <li>The program starts with a welcome message, then prompts the user to enter the calculation they want to perform.</li>
                              <li>If the calculation is written incorrectly, the program will request the user to re-enter it.</li>
                              <li>Detects incorrect entries such as:
                                <ul>
                                  <li>Fraction divided by zero</li>
                                  <li>Fraction containing more than one sign</li>
                                  <li>Incorrectly formatted fractions</li>
                                </ul>
                              </li>
                              <li>Supports operations between fractions and integers.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Fractify"
        },
        {
            title: "SecureX",
            image: "Images/Projects/SecureX.webp",
            description: `  <h4>&#x1F510; Cipher and Decipher Application</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A Cipher and Decipher Application using 10 different methods to encrypt and decrypt messages using C++.</p>
                            
                            <h4>&#x1F511; Featured Ciphers and Deciphers</h4>
                            <ul>
                              <li>Atbash</li>
                              <li>Baconian</li>
                              <li>Polybius Square</li>
                              <li>Simple Substitution</li>
                              <li>Rail Fence</li>
                              <li>Route</li>
                              <li>Vigenere</li>
                              <li>XOR</li>
                              <li>Affine</li>
                              <li>Morse</li>
                            </ul>
                            
                            <h4>&#x2728; Program Features</h4>
                            <ul>
                              <li>The program starts with a welcome message, then asks the user to choose between different types of ciphers.</li>
                              <li>Allows selection between encryption or decryption modes.</li>
                              <li>Accepts a custom phrase to process.</li>
                              <li>Each encryption/decryption type verifies the validity of the statement according to its rules.</li>
                              <li>After processing, the resulting message is displayed to the user.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/SecureX"
        },
        {
            title: "Numerix",
            image: "Images/Projects/Numerix.webp",
            description: `  <h4>&#x1F522; Numbering System Converter</h4>
                            <p><strong>&#x1F4D6; Overview:</strong> A simple Python-based numbering system converter that allows conversion between four different numbering systems:</p>
                            <ul>
                              <li>Decimal</li>
                              <li>Binary</li>
                              <li>Hexadecimal</li>
                              <li>Octal</li>
                            </ul>
                            <h4>&#x2728; Features</h4>
                            <ul>
                              <li>Convert between decimal, binary, hexadecimal, and octal systems.</li>
                              <li>User-friendly command-line interface.</li>
                              <li>Handles both uppercase and lowercase hexadecimal inputs.</li>
                              <li>Validates user input to prevent errors.</li>
                            </ul>`,
            link: "https://github.com/Youssef-Amgad-Elkhatib/Numerix"
        }
    ];


    const projectModal = document.getElementById('project-modal');
    const projectCloseBtn = projectModal ? projectModal.querySelector('.close-btn') : null;

    document.querySelectorAll('.map-point').forEach(point => {
        point.addEventListener('click', () => {
            const id = parseInt(point.dataset.project);
            if (projects[id]) {
                document.getElementById('project-title').textContent = projects[id].title;
                document.getElementById('project-image').src = projects[id].image;
                document.getElementById('project-description').innerHTML = projects[id].description;
                document.getElementById('project-link').href = projects[id].link;
                projectModal.style.display = 'flex';
            }
        });
    });

    if (projectCloseBtn) {
        projectCloseBtn.addEventListener('click', () => {
            projectModal.style.display = 'none';
        });
    }


    /* ========================================================================== */
    /* 04. CERTIFICATES POPUPS (Books & Periodic Elements)                        */
    /* ========================================================================== */
    const certPopup = document.getElementById('certPopup');

    // Fallback: Check for both ID and Class depending on your HTML
    const certCloseBtn = document.getElementById('closeCertBtn') || (certPopup ? certPopup.querySelector('.close-btn') : null);

    // 4A. Click logic for Books (Accordion)
    document.querySelectorAll('.book').forEach(book => {
        book.addEventListener('click', () => {
            const certImg = book.dataset.cert;
            const certDownload = book.dataset.download;
            let certTitle = book.querySelector('span') ? book.querySelector('span').textContent : 'Certificate';

            document.getElementById('certImage').src = certImg;
            document.getElementById('downloadBtn').href = certDownload;
            document.getElementById('certTitle').textContent = certTitle + " Certificate";
            certPopup.style.display = 'flex';
        });
    });

    // 4B. Click logic for Periodic Table Tiles
    document.querySelectorAll('.element-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            document.getElementById('certImage').src = tile.getAttribute('data-cert');
            document.getElementById('downloadBtn').href = tile.getAttribute('data-download');
            document.getElementById('certTitle').innerText = tile.querySelector('.el-name').innerText + " Certificate";
            certPopup.style.display = 'flex';
        });
    });

    // Close logic for Certificates
    if (certCloseBtn) {
        certCloseBtn.addEventListener('click', () => {
            certPopup.style.display = 'none';
        });
    }


    /* ========================================================================== */
    /* 05. GLOBAL MODAL CLOSING (Clicking Outside)                                */
    /* ========================================================================== */
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
        if (e.target === certPopup) {
            certPopup.style.display = 'none';
        }
    });

    /* ========================================================================== */
    /* 06. 3D Carousel                                                            */
    /* ========================================================================== */
    const carousel = document.querySelector('.carousel-3d');
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!carousel || cards.length === 0) return;

    let selectedIndex = 0;
    const cardWidth = 280; // Must match CSS width
    const gap = 20; // Space between cards

    // Calculate perfect 3D geometry
    const theta = 360 / cards.length;
    // Calculate radius required to fit all cards in a circle
    const radius = Math.round((cardWidth + gap) / 2 / Math.tan(Math.PI / cards.length));

    // Position each card in the 3D circle
    cards.forEach((card, index) => {
        const angle = theta * index;
        card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    });

    // Spin mechanism
    function rotateCarousel() {
        const angle = theta * selectedIndex * -1;
        carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    }

    prevBtn.addEventListener('click', () => {
        selectedIndex--;
        rotateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        selectedIndex++;
        rotateCarousel();
    });

    // Initialize the starting position
    rotateCarousel();

    /* ========================================================================== */
    /* 07. SVG MAP LAZY LOADING (INTERSECTION OBSERVER)                           */
    /* ========================================================================== */

    // Create the observer
    const mapImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the image is within 300px of scrolling onto the screen
            if (entry.isIntersecting) {
                const imgElement = entry.target;
                const imagePath = imgElement.getAttribute('data-href');

                if (imagePath) {
                    // Reveal the path to the browser so it starts downloading
                    imgElement.setAttribute('href', imagePath);
                    // Clean up the data attribute
                    imgElement.removeAttribute('data-href');
                }

                // Stop watching this image since it has already been loaded
                observer.unobserve(imgElement);
            }
        });
    }, {
        // Start loading the images 300px BEFORE the user actually scrolls to them
        // so they don't pop in abruptly
        rootMargin: "300px 0px"
    });

    // Find all the images inside the SVG map and attach the observer to them
    const svgMapImages = document.querySelectorAll('.node-img');
    svgMapImages.forEach(img => {
        mapImageObserver.observe(img);
    });

});