import React, { useState, useRef } from 'react';
import { useLanguage } from '../types';
import { generateSellerConsultation } from '../services/geminiService';
import { marked } from 'marked';

interface SellerHubPageProps {
    handleApiError: (err: unknown) => string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    stock: string;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const SellerHubPage: React.FC<SellerHubPageProps> = ({ handleApiError }) => {
    const { language, t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([{ id: crypto.randomUUID(), name: '', description: '', price: '', category: '', brand: '', stock: '' }]);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [audioMimeType, setAudioMimeType] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});


    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    
    const handleAddProduct = () => {
        setProducts([...products, { id: crypto.randomUUID(), name: '', description: '', price: '', category: '', brand: '', stock: '' }]);
    };

    const handleRemoveProduct = (idToRemove: string) => {
        setProducts(products.filter(p => p.id !== idToRemove));
    };
    
    const handleProductChange = (id: string, field: keyof Omit<Product, 'id'>, value: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
        if (validationErrors[id]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };


    const handleImageFile = (file: File) => {
        if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            handleApiError(`Unsupported file type. Please upload a JPEG, PNG, or WebP image.`);
            return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            handleApiError(`File is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = (e.target?.result as string).split(',')[1];
            setImageBase64(base64String);
            setImageMimeType(file.type);
        };
        reader.onerror = () => {
            handleApiError('An error occurred while reading the file.');
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    };
    
    const onRemoveImage = () => {
        setImageBase64(null);
        setImageMimeType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                if (audioChunksRef.current.length === 0) {
                    setError(handleApiError("No audio was recorded. Please try again and speak for a moment."));
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }
                const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0].type });
                const audioB64 = await blobToBase64(audioBlob);
                setAudioBase64(audioB64);
                setAudioMimeType(audioBlob.type);
                setAudioUrl(URL.createObjectURL(audioBlob));
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError(handleApiError("Could not access microphone. Please check permissions."));
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };
    
    const handleRemoveAudio = () => {
        setAudioBase64(null);
        setAudioMimeType(null);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
    };
    
    const validate = (): boolean => {
        const newErrors: Record<string, string[]> = {};
        let isValid = true;

        if (products.length === 0 || products.every(p => !p.name.trim())) {
            setError(t('sellerHub.validation.atLeastOneProduct'));
            return false;
        }

        products.forEach((product) => {
            const productErrors: string[] = [];
            if (!product.name.trim()) {
                productErrors.push(t('sellerHub.validation.productNameRequired'));
                isValid = false;
            }
            if (product.price && isNaN(Number(product.price))) {
                productErrors.push(t('sellerHub.validation.priceNumeric'));
                isValid = false;
            }
            if (product.stock && isNaN(Number(product.stock))) {
                productErrors.push(t('sellerHub.validation.stockNumeric'));
                isValid = false;
            }
            if (productErrors.length > 0) {
                newErrors[product.id] = productErrors;
            }
        });

        setValidationErrors(newErrors);
        return isValid;
    };


    const handleConsultation = async () => {
        setError(null);
        if (!validate()) {
            return;
        }
        
        const productsText = products
            .filter(p => p.name.trim())
            .map(p => `
- Name: ${p.name || 'N/A'}
- Description: ${p.description || 'N/A'}
- Category: ${p.category || 'N/A'}
- Brand: ${p.brand || 'N/A'}
- Price: ${p.price ? `${p.price} ${language === 'fa' ? 'IRT' : ''}`.trim() : 'N/A'}
- Stock Quantity: ${p.stock || 'N/A'}
        `).join('');

        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await generateSellerConsultation(
                productsText, 
                language,
                websiteUrl,
                imageBase64,
                imageMimeType,
                audioBase64,
                audioMimeType
            );
            const htmlResult = await marked.parse(result);
            setAnalysis(htmlResult);
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('sellerHub.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('sellerHub.subtitle')}</p>
            </div>

            <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Product Input Column */}
                <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                    <h2 className="text-2xl font-bold text-white">{t('sellerHub.formTitle')}</h2>
                    
                    {/* Website URL */}
                    <div>
                        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1">{t('sellerHub.websiteUrlLabel')}</label>
                        <input type="url" id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder={t('sellerHub.websiteUrlPlaceholder')} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                    </div>
                    
                    {/* Products List */}
                    <div className="space-y-6">
                        {products.map((product, index) => (
                             <div key={product.id} className="bg-gray-900/50 p-4 rounded-lg border border-white/10 relative">
                                <h3 className="font-semibold text-gray-300 mb-4">Product #{index + 1}</h3>
                                {products.length > 1 && (
                                    <button onClick={() => handleRemoveProduct(product.id)} className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor={`name-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.productNameLabel')}</label>
                                        <input type="text" id={`name-${product.id}`} value={product.name} onChange={e => handleProductChange(product.id, 'name', e.target.value)} placeholder={t('sellerHub.productNamePlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                    </div>
                                    <div>
                                        <label htmlFor={`brand-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.brandLabel')}</label>
                                        <input type="text" id={`brand-${product.id}`} value={product.brand} onChange={e => handleProductChange(product.id, 'brand', e.target.value)} placeholder={t('sellerHub.brandPlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                         <div className="flex flex-wrap gap-1 mt-2">
                                            {(t('sellerHub.presets.brand') as string[]).map(preset => (
                                                <button type="button" key={preset} onClick={() => handleProductChange(product.id, 'brand', preset)} className="px-2 py-0.5 bg-gray-600/50 text-gray-300 text-[10px] rounded-full hover:bg-gray-600">
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor={`description-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.descriptionLabel')}</label>
                                        <input type="text" id={`description-${product.id}`} value={product.description} onChange={e => handleProductChange(product.id, 'description', e.target.value)} placeholder={t('sellerHub.descriptionPlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                    </div>
                                     <div>
                                        <label htmlFor={`category-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.categoryLabel')}</label>
                                        <input type="text" id={`category-${product.id}`} value={product.category} onChange={e => handleProductChange(product.id, 'category', e.target.value)} placeholder={t('sellerHub.categoryPlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {(t('sellerHub.presets.category') as string[]).map(preset => (
                                                <button type="button" key={preset} onClick={() => handleProductChange(product.id, 'category', preset)} className="px-2 py-0.5 bg-gray-600/50 text-gray-300 text-[10px] rounded-full hover:bg-gray-600">
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor={`price-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.priceLabel')}</label>
                                        <input type="text" id={`price-${product.id}`} value={product.price} onChange={e => handleProductChange(product.id, 'price', e.target.value)} placeholder={t('sellerHub.pricePlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                    </div>
                                    <div>
                                        <label htmlFor={`stock-${product.id}`} className="block text-xs font-medium text-gray-400">{t('sellerHub.stockLabel')}</label>
                                        <input type="text" id={`stock-${product.id}`} value={product.stock} onChange={e => handleProductChange(product.id, 'stock', e.target.value)} placeholder={t('sellerHub.stockPlaceholder')} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-white" />
                                    </div>
                                </div>
                                {validationErrors[product.id] && (
                                    <div className="mt-2 text-xs text-red-400 space-y-1">
                                        {validationErrors[product.id].map((err, i) => <p key={i}>{err}</p>)}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddProduct} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            {t('sellerHub.addProduct')}
                        </button>
                    </div>

                     {/* Image Uploader */}
                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('sellerHub.heroImageTitle')}</h3>
                        {imageBase64 ? (
                            <div className="relative group">
                                <img src={`data:${imageMimeType};base64,${imageBase64}`} alt="Hero Product" className="rounded-lg w-full max-w-sm mx-auto shadow-lg" />
                                <button onClick={onRemoveImage} type="button" className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" title={t('sellerHub.removeImage')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                                <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={onFileChange} className="hidden" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">{t('sellerHub.uploadButton')}</button>
                                <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors">{t('sellerHub.cameraButton')}</button>
                            </div>
                        )}
                    </div>

                    {/* Audio Recorder */}
                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('sellerHub.voicePitchTitle')}</h3>
                        {audioUrl ? (
                            <div className="space-y-3">
                                <audio controls src={audioUrl} className="w-full"></audio>
                                <button onClick={handleRemoveAudio} type="button" className="text-sm text-red-400 hover:text-red-300">{t('sellerHub.removeAudio')}</button>
                            </div>
                        ) : (
                            <button onClick={isRecording ? handleStopRecording : handleStartRecording} type="button" className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${isRecording ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}>
                                {isRecording ? t('sellerHub.recordStop') : t('sellerHub.recordStart')}
                                {isRecording && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
                            </button>
                        )}
                    </div>


                    <button
                        onClick={handleConsultation}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : t('sellerHub.buttonText')}
                    </button>
                </div>

                {/* AI Analysis Column */}
                <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 min-h-[400px]">
                     <div className="p-6 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white">{t('sellerHub.consultationTitle')}</h2>
                     </div>
                     <div className="p-6">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
                                <p className="mt-4 text-gray-400">{t('sellerHub.generating')}</p>
                            </div>
                        )}
                        {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                        {!isLoading && !analysis && !error && (
                            <div className="text-center py-10 text-gray-500">
                                <p>{t('sellerHub.placeholder')}</p>
                            </div>
                        )}
                        {analysis && (
                           <div
                                className="prose prose-sm sm:prose-base prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: analysis }}
                            />
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SellerHubPage;