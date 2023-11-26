'use client'

import {Button, DatePicker, Form, Input, InputNumber, message} from "antd";
import dayjs from "dayjs"
import {IEventRaw} from "@/app/lib/types";
import {tKeysMap} from "@/app/lib/tKeysMap";
import {createFullEvent} from "@/app/lib/eventsApi";
import Script from "next/script";


interface ICreateEventFormValues extends Omit<IEventRaw, "date"> {
    date: ReturnType<typeof dayjs>
}

const initialValues: ICreateEventFormValues = {
    place: "BOX 365",
    date: dayjs(Date.now()),
    participantsCount: 10,
    price: "5 BYN"
}

const successMessage = {
    type: 'success',
    content: tKeysMap.createEventForm.successMessage,
} as const

const errorMessage = {
    type: 'error',
    content: tKeysMap.createEventForm.errorMessage,
} as const

export default function CreateEvent() {
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: ICreateEventFormValues) => {
        const normalizedDate = values.date.format('YYYY-MM-DD HH:mm:ss')


        Telegram.WebApp.sendData(JSON.stringify(createFullEvent({
            ...values,
            date: normalizedDate
        })))

        messageApi.open(successMessage);
    };

    const onFinishFailed = () => {
        messageApi.open(errorMessage);
    };

    return <>
        {contextHolder}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive"/>
        <Form
            layout={"vertical"}
            name="basic"
            onFinish={onFinish}
            initialValues={initialValues}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<IEventRaw> label="Place" name="place" rules={[{required: true}]}>
                <Input/>
            </Form.Item>

            <Form.Item<IEventRaw> label="Date" name="date" rules={[{required: true}]}>
                <DatePicker format={'YYYY-MM-DD HH:mm:ss'} showTime style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item<IEventRaw> label="Price" name="price" rules={[{required: true}]}>
                <Input/>
            </Form.Item>

            <Form.Item<IEventRaw> label="Participants Count" name="participantsCount" rules={[{required: true}]}>
                <InputNumber style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </>
};
