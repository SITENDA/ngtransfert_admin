import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../features/auth/authSlice";
import { darkColor, lightColor } from "../util/initials";
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper
} from '@mui/material';

const Tables = ({ theadLabels, tfootLabels, tbodyContents }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    useEffect(() => {
        // Initialize any required JavaScript plugins here if needed
    }, []);

    return (
        <Card sx={{ mb: 4, boxShadow: 3, background: isDarkTheme ? darkColor : lightColor }}>
            <CardContent sx={{ background: isDarkTheme ? darkColor : lightColor, color: isDarkTheme ? lightColor : darkColor }}>
                <TableContainer component={Paper} sx={{ background: isDarkTheme ? darkColor : lightColor }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ background: isDarkTheme ? darkColor : lightColor }}>
                            <TableRow>
                                {theadLabels.map((label, index) => (
                                    <TableCell key={index} sx={{ color: isDarkTheme ? lightColor : darkColor }}>{label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableFooter sx={{ background: isDarkTheme ? darkColor : lightColor }}>
                            <TableRow>
                                {tfootLabels.map((label, index) => (
                                    <TableCell key={index} sx={{ color: isDarkTheme ? lightColor : darkColor }}>{label}</TableCell>
                                ))}
                            </TableRow>
                        </TableFooter>
                        <TableBody sx={{ background: isDarkTheme ? darkColor : lightColor }}>
                            {tbodyContents.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} sx={{ color: isDarkTheme ? lightColor : darkColor }}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default Tables;
