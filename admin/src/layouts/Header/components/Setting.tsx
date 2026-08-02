import { Button, Col, Drawer, Row, Slider, ColorPicker } from "antd";
import { MoonFilled, SettingFilled, SunFilled, CheckOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSettingStore } from "@/stores";
import type{ ThemeModeType, LayoutModeType, FontType } from "@/types";
import { ThemeModeEnum, LayoutModeEnum, FontTypeEnum, PresetColorEnum } from "@/enums";


export default function Setting() {
    const [open, setOpen] = useState(false);
    const { 
        themeMode, 
        layoutMode, 
        primaryColor, 
        fontFamily, 
        fontSize, 
        setThemeMode, 
        setLayoutMode, 
        setPrimaryColor, 
        setFontFamily, 
        setFontSize 
    } = useSettingStore();

    // 组件加载时，根据当前主题模式设置html的dark类
    useEffect(() => {
        document.documentElement.classList.toggle('dark', themeMode === ThemeModeEnum.Dark);
    }, []);

    // 切换白天/黑夜模式
    const handleThemeMode = ( type: ThemeModeType ) => {
        setThemeMode(type);
        document.documentElement.classList.toggle('dark', type === ThemeModeEnum.Dark);
    };

    // 切换布局模式
    const handleLayoutMode = ( type: LayoutModeType ) => {
        setLayoutMode(type);
    };

    // 切换主题色
    const handlePrimaryColor = ( color: string ) => {
        setPrimaryColor(color);
    };

    // 切换字体
    const handleFontFamily = ( font: FontType ) => {
        setFontFamily(font);
    };

    // 切换字体大小
    const handleFontSize = ( size: number ) => {
        setFontSize(size);
    };

    // 预设主题色列表
    const presetColors = Object.values(PresetColorEnum);

    return (
        <>
            <Button type="text" icon={<SettingFilled />} onClick={() => setOpen(true)}></Button>
            <Drawer
                title="设置"
                placement="right"
                mask={false}
                onClose={() => setOpen(false)}
                closable={{ placement: 'end' }}
                open={open}
                size={400}
            >
                {/* 模式设置 */}
                <Row gutter={16}>
                    <Col className={`text-lg font-bold my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>模式</Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${themeMode === 'light' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleThemeMode(ThemeModeEnum.Light)}
                        >
                            <SunFilled style={{ fontSize: 24, color: themeMode === 'light' ? primaryColor : themeMode === 'dark' ? '#fff' : '#000' }} />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${themeMode === 'dark' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleThemeMode(ThemeModeEnum.Dark)}
                        >
                            <MoonFilled style={{ fontSize: 24, color: themeMode === 'dark' ? primaryColor : '#000' }} />
                        </div>
                    </Col>
                </Row>

                {/* 布局设置 */}
                <Row gutter={16}>
                    <Col className={`text-lg font-bold my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>布局</Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${layoutMode === 'expanded' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleLayoutMode(LayoutModeEnum.Expanded)}
                        >
                            <MenuUnfoldOutlined style={{ fontSize: 24, color: layoutMode === 'expanded' ? primaryColor : themeMode === 'dark' ? '#fff' : '#000' }} />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${layoutMode === 'collapsed' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleLayoutMode(LayoutModeEnum.Collapsed)}
                        >
                            <MenuFoldOutlined style={{ fontSize: 24, color: layoutMode === 'collapsed' ? primaryColor : themeMode === 'dark' ? '#fff' : '#000' }} />
                        </div>
                    </Col>
                </Row>

                {/* 主题色设置 */}
                <Row gutter={16}>
                    <Col className={`text-lg font-bold my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>主题色</Col>
                    {presetColors.map((color, index) => (
                        <Col key={index} span={4}>
                            <div 
                                className={`relative cursor-pointer transition-all duration-300 ${primaryColor === color ? 'w-16 h-16' : 'w-16 h-24'}`}
                                onClick={() => handlePrimaryColor(color)}
                            >
                                <div 
                                    className="w-full h-full rounded flex items-center justify-center"
                                    style={{ backgroundColor: color }}
                                >
                                    {primaryColor === color && (
                                        <CheckOutlined style={{ color: '#fff', fontSize: 16 }} />
                                    )}
                                </div>
                            </div>
                        </Col>
                    ))}
                    <Col span={24} className="mt-4">
                        <ColorPicker 
                            value={primaryColor} 
                            onChange={(_, hex) => handlePrimaryColor(hex)} 
                        />
                    </Col>
                </Row>

                {/* 字体设置 */}
                <Row gutter={16}>
                    <Col className={`text-lg font-bold my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>字体</Col>
                    <Col className={`text-md font-medium my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>字体系列</Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${fontFamily === 'system' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleFontFamily(FontTypeEnum.System)}
                        >
                            <span style={{ fontFamily: 'system-ui', fontSize: 16, color: fontFamily === 'system' ? primaryColor : themeMode === 'dark' ? '#fff' : '#000' }}>系统字体</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div 
                            className={`h-20 border border-solid rounded flex items-center justify-center cursor-pointer transition-colors ${fontFamily === 'custom' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handleFontFamily(FontTypeEnum.Custom)}
                        >
                            <span style={{ fontFamily: 'Arial', fontSize: 16, color: fontFamily === 'custom' ? primaryColor : themeMode === 'dark' ? '#fff' : '#000' }}>自定义字体</span>
                        </div>
                    </Col>
                    
                    <Col className={`text-md font-medium my-2 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`} span={24}>字体大小</Col>
                    <Col span={24}>
                        <Slider 
                            min={12} 
                            max={18} 
                            value={fontSize} 
                            onChange={handleFontSize} 
                            marks={{ 12: '12px', 14: '14px', 16: '16px', 18: '18px' }} 
                        />
                    </Col>
                </Row>
            </Drawer>
        </>
    );
}
