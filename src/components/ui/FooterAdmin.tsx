import { Mail, Phone } from "lucide-react";

export default function FooterAdmin() {
    return (
        <footer className="w-full bg-background py-4 border-t">
        <div className="container mx-auto flex flex-col items-center justify-center text-center text-sm space-y-2">

            {/* Contact Info */}
            <div className="flex items-center space-x-4 text-muted-foreground">
    <div className="flex items-center space-x-2">
    <Phone className="h-4 w-4" />
        <span>+86 15698157735</span>
    </div>
    <div className="flex items-center space-x-2">
    <Mail className="h-4 w-4" />
        <span>imdouc2@gmail.com</span> 
    </div>
    </div>

    {/* Copyright Notice */}
    <p className="text-xs text-muted-foreground">
        Copyright &copy; {new Date().getFullYear()} - NGTransfert
    </p>
    </div>
    </footer>
);
}
