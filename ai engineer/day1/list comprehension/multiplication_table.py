# Rewrite a nested for loop that builds a multiplication table (1-5) using a list comprehension.

def print_multiplication_table_for_1_5_number():
    multiplication_table = [[i*j for j in range(1, 6)] for i in range(1, 6)]

    print(multiplication_table)

    print("    " + " ".join(f"{j:3}" for j in range(1, 6)))
    print("    " + "-" * 19)

    for i, row in enumerate(multiplication_table, start=1):
        row_string = " ".join(f"{num:3}" for num in row)
        print(f"{i:2} | {row_string}")



def print_multiplication_table_for_any_number(max_num):
    # 1. Generate the table using a nested list comprehension
    table = [[i * j for j in range(1, max_num + 1)] for i in range(1, max_num + 1)]
    
    # 2. Dynamically calculate padding based on the largest number
    max_width = len(str(max_num * max_num)) + 1
    row_header_width = len(str(max_num)) + 1
    
    # 3. Print column headers
    col_headers = "".join(f"{j:>{max_width}}" for j in range(1, max_num + 1))
    divider_length = row_header_width + 3 + (max_width * max_num)
    
    print(f"{'':>{row_header_width}}  {col_headers}")
    print(f"{'':>{row_header_width}}  " + "-" * (max_width * max_num))
    
    # 4. Print rows with row headers
    for i, row in enumerate(table, start=1):
        row_string = "".join(f"{num:>{max_width}}" for num in row)
        print(f"{i:>{row_header_width}} |{row_string}")


# Example: Generate a 1-5 table
print_multiplication_table_for_1_5_number()

# Example: Generate a 1-12 table
print_multiplication_table_for_any_number(10)

