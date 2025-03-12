import React from "react";
import ToolCalling from "./_components/ToolCalling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Chat = () => {
  return (
    <div className="p-4 flex flex-col gap-5 justify-self-center">
      <Tabs defaultValue="tool-calling">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tool-calling">Tool Calling</TabsTrigger>
          <TabsTrigger value="other">
            other
          </TabsTrigger>
          
        </TabsList>
        <TabsContent value="tool-calling">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ToolCalling />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              other
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>{" "}
    </div>
  );
};

export default Chat;
