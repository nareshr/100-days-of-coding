# Implement a BankAccount class with deposit, withdraw, and balance methods.

class BankAccount: 
    def __init__(self, balance = 0): 
        self._balance = balance
        
    def deposit(self, amount):
        self._balance += amount 
    
    def withdraw(self, amount):
        if amount > self._balance: 
            raise ValueError("Insufficient funds") 
        self._balance -= amount 
    
    def balance(self): 
        return self._balance