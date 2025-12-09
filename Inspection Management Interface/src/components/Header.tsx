import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Header() {
  const handleCardClick = (cardName: string) => {
    toast.info(`Viewing detailed information for ${cardName}`);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl">Inspection Management</h1>
          <Button variant="outline" size="sm" onClick={() => toast.info("Opening system settings...")}>
            <Info className="h-4 w-4 mr-2" />
            System Info
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("Part/Product")}
          >
            <div className="text-xs text-slate-500 mb-1">Part / Product</div>
            <div className="font-medium">Frame Assembly XJ-2400</div>
            <div className="text-xs text-slate-600 mt-1">P/N: FA-XJ2400-R03</div>
            <div className="text-xs text-slate-500 mt-1">Rev: 03</div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("Line & Station")}
          >
            <div className="text-xs text-slate-500 mb-1">Line & Station</div>
            <div className="font-medium">Line 3 / Station 12</div>
            <div className="text-xs text-slate-600 mt-1">Final Assembly</div>
            <div className="text-xs text-slate-500 mt-1">Shift: A (Day)</div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("Customer")}
          >
            <div className="text-xs text-slate-500 mb-1">Customer</div>
            <div className="font-medium">OEM Motors Inc.</div>
            <div className="text-xs text-slate-600 mt-1">Contract: QC-2024-0890</div>
            <div className="text-xs text-slate-500 mt-1">Tier 1 Supplier</div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("Phase & Sampling Regime")}
          >
            <div className="text-xs text-slate-500 mb-1">Current Phase & Sampling</div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="bg-green-600">Production</Badge>
            </div>
            <div className="text-xs text-slate-600">AQL 1.0 Normal, Level II</div>
            <div className="text-xs text-slate-500 mt-1">Days in phase: 45</div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("Standards")}
          >
            <div className="text-xs text-slate-500 mb-1">Standards in Force</div>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs">ISO 9001</Badge>
              <Badge variant="outline" className="text-xs">IATF 16949</Badge>
              <Badge variant="outline" className="text-xs">ISO 2859-1</Badge>
            </div>
            <div className="text-xs text-slate-500 mt-1">Last audit: 2024-09</div>
          </Card>
        </div>
      </div>
    </header>
  );
}