'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

export interface TodayRevenueProps {
  sx?: SxProps;
}

export function TodayRevenue({ sx }: TodayRevenueProps): React.JSX.Element {
  // const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  // const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  const [revenue, setRevenue] = useState('0');
  const [diff, setDiff] = useState<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  const formatToThousands = (num: number): string => {
    if (num >= 1000 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'k';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    return num.toLocaleString(); // fallback for numbers below 1000
  };

  useEffect(() => {
    // Load and process the CSV file
    d3.csv('/datasets/transactions_new.csv').then(function (data) {
      // Extract date parts as YYYY-MM-DD strings
      data.forEach((d: any) => {
        d.date_only = d.created_at.split(' ')[0];
      });

      // Find the latest date string in the dataset
      const latestDate = d3.max(data, (d: any) => d.date_only);

      // Filter transactions by the latest date string
      const latestTransactions = data.filter((d: any) => d.date_only === latestDate);

      // Calculate the total revenue for the latest date
      const totalRevenue = d3.sum(latestTransactions, (d: any) => +Number(d.total_amount));

      // Find the second latest date (yesterday)
      const secondLatestDate = d3.max(data.filter((d: any) => d.date_only < latestDate), (d: any) => d.date_only);

      // Filter transactions by the second latest date string
      const secondLatestTransactions = data.filter((d: any) => d.date_only === secondLatestDate);

      // Calculate the total revenue for the second latest date
      const totalRevenueYesterday = d3.sum(secondLatestTransactions, (d: any) => +Number(d.total_amount));

      // Calculate the percentage difference
      const revenueDiff = ((totalRevenue - totalRevenueYesterday) / totalRevenueYesterday) * 100;

      // Set the trend direction and revenue difference
      setTrend(totalRevenue >= totalRevenueYesterday ? 'up' : 'down');
      setDiff(Math.abs(revenueDiff));

      // Update the state with today's revenue
      setRevenue(formatToThousands(totalRevenue));
    });
  }, []);

  // Determine the trend icon and color
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  // return (
  //   <TodayRevenue value={`$${revenue}`} trend="up" diff={10} />
  // );
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={5}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={3}>
              <Typography color="text.secondary" variant="overline">
                Today&apos;s Revenue
              </Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <Typography variant="h2">${revenue}</Typography>

          {diff ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff.toFixed(2)}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since yesterday
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}