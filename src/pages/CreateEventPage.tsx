import {Button, DatePicker, Form, Input, InputNumber, message} from "antd";
import {IEventRaw} from "../types";
import dayjs from "dayjs"
import {TKeysMap} from "../tKeysMap";
import {routeMap} from "../routeMap";

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
    content: TKeysMap.createEventForm.successMessage,
} as const

const errorMessage = {
    type: 'error',
    content: TKeysMap.createEventForm.errorMessage,
} as const

const CreateEventPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: ICreateEventFormValues) => {
        const normalizedDate = values.date.format('YYYY-MM-DD HH:mm:ss')

        await fetch(routeMap.apiCreateEventRoute, {
            body: JSON.stringify({
                ...values,
                date: normalizedDate
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        messageApi.open(successMessage);
    };

    const onFinishFailed = () => {
        messageApi.open(errorMessage);
    };

    return <>
        {contextHolder}
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

export {CreateEventPage};
