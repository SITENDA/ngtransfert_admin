import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setItem, selectIsDarkTheme } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllWechatAccountsQuery } from '../features/wechatAccounts/wechatAccountsSlice';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';
import ErrorBoundary from './ErrorBoundary';
import { usersApiSlice } from '../features/users/usersSlice';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    IconButton,
    Button,
    createTheme,
    ThemeProvider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CommentIcon from '@mui/icons-material/Comment';
import MainPageWrapper from "./MainPageWrapper";
import { darkColor, lightColor } from '../util/initials';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const navigate = useNavigate();
    const [loanRequestsData, setLoanRequestsData] = useState([]);
    const { data, isLoading } = useGetAllWechatAccountsQuery();
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Earnings",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            xAxisID: 'xAxes',
            yAxisID: 'yAxes',
            data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
        }]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: {
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            },
            yAxes: {
                ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                    callback: function (value) {
                        return '$' + number_format(value);
                    }
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            },
        },
        legend: {
            display: false
        },
        plugins: {
            tooltip: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': $' + number_format(tooltipItem.parsed.y);
                    }
                }
            }
        }
    };

    function number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    useEffect(() => {
        dispatch(setItem({ key: 'title', value: 'Welcome CEO!' }));
        Chart.register(LineController, CategoryScale, LineElement, PointElement, LinearScale, Title);
        Chart.defaults.font.family = 'Nunito, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.font.color = '#858796';
        dispatch(usersApiSlice.endpoints.getAllUsers.initiate());
    }, [dispatch]);

    let chart;

    setTimeout(() => {
        const ctx = document.getElementById("myAreaChart");
        try {
            if (ctx !== null && chartData !== null && chartOptions !== null) {
                if (chart) {
                    chart.destroy();
                    chart = new Chart(ctx, {
                        type: 'line',
                        data: chartData,
                        options: chartOptions
                    });
                } else {
                    chart = new Chart(ctx, {
                        type: 'line',
                        data: chartData,
                        options: chartOptions
                    });
                }
            }
        } catch (error) {
            console.log("Error occurred: ", error);
        }
    }, 100);

    useEffect(() => {
        if (!isLoading && data && data.entities) {
            const loanRequestsArray = Object.values(data.entities);
            setLoanRequestsData(loanRequestsArray);
        }
    }, [data, isLoading]);

    const handleRequestLoanClick = () => {
        navigate('../../requestloan', { state: { user } });
    };

    const handleEnterPaymentClick = () => {
        navigate('../../newPayment', { state: { user } });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Box>
        );
    }

    const numOfLoanRequests = loanRequestsData.length;
    const numOfCurrentLoans = 0;
    const numOfNewlySettledLoans = 0;
    const numOfInvestments = 0;
    const recentPayments = 0;

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            primary: {
                main: '#4e73df',
            },
            secondary: {
                main: '#36b9cc',
            },
            background: {
                default: isDarkTheme ? darkColor : lightColor,
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary fallback="Error in dashboard">
                <MainPageWrapper>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ borderLeft: '5px solid #4e73df', boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                    Earnings (Monthly)
                                                </Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    $40,000
                                                </Typography>
                                            </Box>
                                            <CalendarTodayIcon fontSize="large" sx={{ color: 'gray' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ borderLeft: '5px solid #1cc88a', boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                    Earnings (Annual)
                                                </Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    $215,000
                                                </Typography>
                                            </Box>
                                            <AttachMoneyIcon fontSize="large" sx={{ color: 'gray' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ borderLeft: '5px solid #36b9cc', boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                    Invested
                                                </Typography>
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h5" fontWeight="bold" mr={1}>
                                                        50%
                                                    </Typography>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Box height="10px" width="100%" borderRadius="5px" bgcolor="#e0e0e0">
                                                            <Box
                                                                height="100%"
                                                                width="50%"
                                                                borderRadius="5px"
                                                                bgcolor="#36b9cc"
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <AssessmentIcon fontSize="large" sx={{ color: 'gray' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ borderLeft: '5px solid #f6c23e', boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                    Pending Requests
                                                </Typography>
                                                <Typography variant="h5" fontWeight="bold">
                                                    18
                                                </Typography>
                                            </Box>
                                            <CommentIcon fontSize="large" sx={{ color: 'gray' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} mt={3}>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" fontWeight="bold" color="primary">
                                                Earnings Overview
                                            </Typography>
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                        <Box mt={3}>
                                            <canvas id="myAreaChart"></canvas>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" fontWeight="bold" color="primary">
                                                Revenue Sources
                                            </Typography>
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                        <Box mt={3}>
                                            <canvas id="myPieChart"></canvas>
                                        </Box>
                                        <Box mt={3} display="flex" justifyContent="space-around">
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    sx={{
                                                        height: '10px',
                                                        width: '10px',
                                                        borderRadius: '50%',
                                                        bgcolor: '#4e73df',
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography variant="body2">Direct</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    sx={{
                                                        height: '10px',
                                                        width: '10px',
                                                        borderRadius: '50%',
                                                        bgcolor: '#1cc88a',
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography variant="body2">Social</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    sx={{
                                                        height: '10px',
                                                        width: '10px',
                                                        borderRadius: '50%',
                                                        bgcolor: '#36b9cc',
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography variant="body2">Referral</Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </MainPageWrapper>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default Dashboard;
