import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../features/auth/authSlice";
import { darkColor, lightColor } from "../util/initials";
import {
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
import '../assets/css/Tables.css'

const Tables = ({ theadLabels, tfootLabels, tbodyContents }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

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
