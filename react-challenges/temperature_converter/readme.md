**Temperature Converter**

Welcome to the Celsius to Fahrenheit (and vice versa) converter lab! In this coding challenge, you will be building a simple temperature converter to practice your skills in React.

**Objective**
Your task is to design a two-way temperature converter:

1. Convert Celsius to Fahrenheit.
2. Convert Fahrenheit to Celsius.

**Instructions**
1. **Setup**: This lab provides a complete environment for you. No extra setup is required on your end. Start coding directly!

2. **Input Fields**: Implement two input fields:

   1. A Celsius input with the id of celsius.
   2. A Fahrenheit input with the id of fahrenheit.
   
   Both fields should be of the number type.

3. **Default Value**: The Celsius input (#celsius) should be initialized with a value of 0 when the application starts.

4. **Synchronization**: The most critical aspect of this lab is to keep the Celsius and Fahrenheit inputs synchronized. When a user enters a value in one input, the other should automatically adjust to reflect the converted temperature.

**Conversion Formulae**
1. To convert from Celsius to Fahrenheit:
2. Fahrenheit = (Celsius × 9/5) + 32

To convert from Fahrenheit to Celsius:
Celsius = (Fahrenheit - 32) × 5/9

**Challenges Information**

**Challenge 1: Create Celsius Input**

Objective:
1. Implement an input field to capture temperatures in Celsius.

**Requirements:**
1. The input field should have an id attribute labeled celsius.
2. It must be of type number so only numerical values can be entered.

**Challenge 2: Create Fahrenheit Input**

**Objective**:
1. Design an input field to capture temperatures in Fahrenheit.

**Requirements:**
1. The input field must have an id attribute named fahrenheit.
2. It should be of the type number.


**Challenge 3: Initialize Celsius Value**

**Objective:**
1. Set a starting value for the Celsius input field when the application is loaded.

**Requirements:**
1. When the application is initiated, the #celsius input field should automatically have the value 0.

**Challenge 4: Synchronize Celsius and Fahrenheit Fields**

**Objective:**
1. Keep the Celsius and Fahrenheit input fields in sync. If one field is updated, the other should adjust to reflect the right converted temperature.
   
**Requirements:**

1. When a value is entered into the #celsius field, the #fahrenheit field should reflect its Fahrenheit equivalent. Use the formula: Fahrenheit = (Celsius * 9/5) + 32.

2. Similarly, when a value is inputted into the #fahrenheit field, the #celsius field should adjust to its Celsius equivalent. Use the formula: Celsius = (Fahrenheit - 32) * 5/9.