import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  splitAmong: string[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const AVATAR_COLORS = [
  '#f56a00', '#7265e6', '#ffbf00', '#00a2ae',
  '#87d068', '#ff4d4f', '#1890ff', '#722ed1',
  '#eb2f96', '#13c2c2', '#fa8c16', '#52c41a',
];

@Component({
  selector: 'app-expense-view',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzModalModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzAvatarModule,
    NzStatisticModule,
    NzAlertModule,
    NzToolTipModule,
    NzInputNumberModule,
    NzBadgeModule,
  ],
  templateUrl: './expense-view.html',
  styleUrl: './expense-view.scss',
})
export class ExpenseView {
  // Members
  members: string[] = [];
  newMemberName = '';

  // Expenses
  expenses: Expense[] = [];
  private nextId = 1;

  // Modal state
  isModalVisible = false;
  editingExpense: Partial<Expense> = {};

  // Settlement results
  settlements: Settlement[] = [];

  // Summary stats
  get totalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  get totalTransactions(): number {
    return this.settlements.length;
  }

  // --- Members ---
  addMember(): void {
    const name = this.newMemberName.trim();
    if (name && !this.members.includes(name)) {
      this.members.push(name);
      this.newMemberName = '';
      this.calculateSettlements();
    }
  }

  removeMember(name: string): void {
    this.members = this.members.filter(m => m !== name);
    // Remove expenses that reference this member
    this.expenses = this.expenses.map(e => ({
      ...e,
      splitAmong: e.splitAmong.filter(s => s !== name),
    })).filter(e => e.splitAmong.length > 0 && this.members.includes(e.paidBy));
    this.calculateSettlements();
  }

  getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  // --- Expenses ---
  showAddExpenseModal(): void {
    this.editingExpense = {
      description: '',
      amount: 0,
      paidBy: this.members.length > 0 ? this.members[0] : '',
      date: new Date(),
      splitAmong: [...this.members],
    };
    this.isModalVisible = true;
  }

  handleModalOk(): void {
    const e = this.editingExpense;
    if (!e.description || !e.amount || !e.paidBy || !e.splitAmong?.length) {
      return;
    }
    this.expenses = [...this.expenses, {
      id: this.nextId++,
      description: e.description!,
      amount: e.amount!,
      paidBy: e.paidBy!,
      date: e.date || new Date(),
      splitAmong: [...e.splitAmong!],
    }];
    this.isModalVisible = false;
    this.calculateSettlements();
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  deleteExpense(id: number): void {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.calculateSettlements();
  }

  toggleSplitMember(member: string): void {
    if (!this.editingExpense.splitAmong) {
      this.editingExpense.splitAmong = [];
    }
    const idx = this.editingExpense.splitAmong.indexOf(member);
    if (idx >= 0) {
      this.editingExpense.splitAmong.splice(idx, 1);
    } else {
      this.editingExpense.splitAmong.push(member);
    }
  }

  isSplitMember(member: string): boolean {
    return this.editingExpense.splitAmong?.includes(member) ?? false;
  }

  selectAllMembers(): void {
    this.editingExpense.splitAmong = [...this.members];
  }

  deselectAllMembers(): void {
    this.editingExpense.splitAmong = [];
  }

  // --- Settlement Calculation (Greedy Algorithm) ---
  calculateSettlements(): void {
    if (this.expenses.length === 0 || this.members.length < 2) {
      this.settlements = [];
      return;
    }

    // Calculate net balance for each member
    const balance: Record<string, number> = {};
    this.members.forEach(m => (balance[m] = 0));

    this.expenses.forEach(expense => {
      const share = expense.amount / expense.splitAmong.length;
      // The payer paid for everyone, so they are owed money
      balance[expense.paidBy] = (balance[expense.paidBy] || 0) + expense.amount;
      // Each person in splitAmong owes their share
      expense.splitAmong.forEach(person => {
        balance[person] = (balance[person] || 0) - share;
      });
    });

    // Greedy settlement: match largest debtor with largest creditor
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    Object.entries(balance).forEach(([name, amount]) => {
      if (amount < -0.01) {
        debtors.push({ name, amount: -amount }); // amount they owe
      } else if (amount > 0.01) {
        creditors.push({ name, amount }); // amount they are owed
      }
    });

    // Sort descending
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const result: Settlement[] = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount);
      if (transfer > 0.01) {
        result.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amount: Math.round(transfer * 100) / 100,
        });
      }
      debtors[i].amount -= transfer;
      creditors[j].amount -= transfer;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    this.settlements = result;
  }

  formatterVND = (value: number): string => `${new Intl.NumberFormat('vi-VN').format(value)}`;
  parserVND = (value: string): number => Number(value.replace(/\D/g, ''));

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  }
}
