interface LINEPostEvent {
    type: string;
    message: {
        type: string;
        text: string;
    };
    replyToken?: string;
}
