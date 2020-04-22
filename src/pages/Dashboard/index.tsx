import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import Header from '../../components/Header';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import { Card, CardContainer, Container, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try {
        const response = await api.get<Response>('transactions');

        const dataTransactions = response.data.transactions;
        setTransactions(
          dataTransactions.map(transaction => ({
            ...transaction,
            formattedValue:
              transaction.type === 'outcome'
                ? `- ${formatValue(transaction.value)}`
                : formatValue(transaction.value),
            formattedDate: String(
              format(new Date(transaction.created_at), 'dd/MM/yyyy'),
            ),
          })),
        );

        const balanceData = response.data.balance;
        setBalance({
          income: formatValue(Number(balanceData.income)),
          outcome: formatValue(Number(balanceData.outcome)),
          total: formatValue(Number(balanceData.total)),
        });
      } catch (err) {
        toast.error('Ops! an error happened');
      }
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Income</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Outcome</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Value</th>
                <th>Category</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
