# Welcome

### Thank you for exploring S & D Budget-Sheet.

It is a simple accounting application to keep track of personal financial transactions.

This application is developed using Node.js, Express.js, and some basic HTML and CSS. Google-Spreadsheet is used as a database. The user interface is responsive and minimal.

**Feel free to Clone and Fork. Commercial Distribution is Prohibited.**

---

## Background (_Why this application was developed?_)

I am currently pursuing my undergraduate degree in Computer Science from Alcorn State University. My first semester of senior year was completed at the end of April 2020. Since then, I was spending my time watching movies and enhancing my programming skills.

Around a week ago, my wife who is a finance graduate from Tribhuvan University asked me to suggest a free and reliable application to keep track of daily financial transactions. She further mentioned that it should be easy to use and accessible from anywhere. She wanted to analyze our monthly income and expenses.

I immediately suggested her to use **Google Sheets.** It was the first thing that came on my mind. She downloaded the Google Sheets mobile app and started using it. It had all the features she asked for and she didn’t mention any problem. A few days ago, while having our daily breakfast she suddenly remembered to add an expense. I was looking at her phone while she was doing so. I noticed that the experience of adding and analyzing records in Google Sheet mobile application was not smooth. She was accidentally touching the wrong cells and correcting errors.

I got motivated at that very moment to develop this application. I spent the last two days on developing and finally deployed on the cloud. She is more than happy to use this application. It has all the features she asked for, it is still using the Google Spreadsheet as a database but it is much easier to add and analyze data with simple, minimal, and responsive UI. Most importantly, the name includes both of us; S & D **(Sajjal and Deepa)**.

That’s the story behind the development of this application now let’s move on to installation.

---

## Prerequisites:

### Node.js:

- Install **Node.js** in your computer.

### Google-SpreadSheet API:

1. Go to **Google developer console** and create a new project.
2. Click on Enable API and Services.
3. Scroll down to **Google Drive API** and click Enable.
4. Click on Create Credentials.
5. Select **Google Drive API** from dropdown (_What API are you using?_).
6. Select **Web Server** from dropdown (_Where will you be calling the API from?_)
7. Select **Application Data** (_What data you will be accessing?_)
8. Select **No, I am not using them**. (_Are you planning to use this API with App Engine or Compute Engine?_)
9. Click on **What Credentials do I need?**
10. Give a name to your service account and select role as **project editor**.
11. Select key type as **JSON** and click continue.
12. Save the file to the project directory and rename it to: **client_secret.json**

---

### Google Sheets:

1. Go to **Google Sheets** and create a blank document.
2. Add: `Date, Category, Description, and Amount` respectively from cell **A1** to **D1**.
3. Select **Column A** and change format to **Number** and **six digits after Decimal**.
4. Select **Column D** and change format to **Currency**.
5. Rename current sheet to **Expense_Report**.
6. Duplicate the current sheet and rename it to **Income_Report**.
7. Make sure the first sheet is Expense_Report and second sheet is Income_Record.
8. Open the previously downloaded **client_secret.json** file to your text editor and copy the **client email address**.
9. Back to Google-Sheet click on **Share**, paste in the email address and click Done.
10. Take a note at the url of Google-Sheet: Copy the **string between**
    `[https://docs.google.com/spreadsheets/d/]` and `[edit]` It should be something like this: `1QHiP6gcGHKUIfyArRZ42JHnaznp_z0nXoa-mHVV`
    This is the **id** of your document.

---

## Installation:

1. Clone this Project.
2. Paste the **client_secret.json** file to the **Project directory.**
3. Go to **modules—>config.js** and open it in text editor.
4. Paste your **document id** inside
   `doc: new GoogleSpreadsheet(‘`**Paste your document id Here**`’);` and save it.
5. Modify the value of `TOKEN_SECRET` and `ACCESS_CODE` _(You can put anything)_ on `.env` file
   <br>
   **Note:** `.env` file might be hidden
6. Open terminal/command prompt. **cd** to project directory and type:

   i. `npm install`

   ii. `npm start`

7. Go to `http://localhost:3641` on your browser. **Enjoy.**

---

## Demo:

**Add Records:**

<img src="https://github.com/Sajjal/Budget-Sheet/blob/master/OLD_Light_UI/Screen_shots/add_record.png">

---

**View Records:**

<img src="https://github.com/Sajjal/Budget-Sheet/blob/master/OLD_Light_UI/Screen_shots/view_record.png">

---

**Filter Records:**

<img src="https://github.com/Sajjal/Budget-Sheet/blob/master/OLD_Light_UI/Screen_shots/filter_record.png">

---

**Export Records for Printing:**

<img src="https://github.com/Sajjal/Budget-Sheet/blob/master/OLD_Light_UI/Screen_shots/export_record.png">

---

**Note:** The modules of Updating and deleting records are excluded intentionally for security reasons.

With Love,

**Sajjal**
