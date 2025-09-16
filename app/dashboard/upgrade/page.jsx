import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import pricingPlans from './_components/PricingPlan';

function withPrefilledEmail(link, email) {
    if (!email) return link;
    const separator = link.includes('?') ? '&' : '?';
    return `${link}${separator}prefilled_email=${encodeURIComponent(email)}`;
}

const featuresByDuration = {
    '/month': ['10 users included', '2GB storage', 'Email support', 'Help center access'],
    '/year': ['20 users included', '5GB storage', 'Email support', 'Phone support', 'Community access']
};

const Upgrade = async () => {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress || '';

    return (
        <div className="p-10">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Upgrade your plan</h1>
                    <p className="mt-2 text-gray-600">Choose a plan that fits your needs. Cancel anytime.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
                    {pricingPlans.map((item, idx) => {
                        const features = featuresByDuration[item.duration] || [];
                        const href = withPrefilledEmail(item.link, email);
                        return (
                            <div
                                key={idx}
                                className={
                                    'group rounded-2xl border p-6 shadow-sm sm:px-8 lg:p-12 transition-all ' +
                                    'border-gray-200 ' +
                                    'hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600'
                                }
                            >
                                <div className="text-center">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {item.duration === '/year' ? 'Pro' : 'Starter'}
                                        <span className="sr-only">Plan</span>
                                    </h2>
                                    <p className="mt-2 sm:mt-4">
                                        <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> {item.price}$ </strong>
                                        <span className="text-sm font-medium text-gray-700">{item.duration}</span>
                                    </p>
                                </div>
                                <ul className="mt-6 space-y-2">
                                    {features.map((feature) => (
                                        <li className="flex items-center gap-1" key={feature}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-5 text-indigo-700"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span className="text-gray-700"> {feature} </span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={
                                        'mt-8 block rounded-full border px-12 py-3 text-center text-sm font-medium focus:outline-hidden ' +
                                        'border-indigo-600 bg-white text-indigo-600 ' +
                                        'group-hover:bg-indigo-600 group-hover:text-white'
                                    }
                                >
                                    Get Started
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Upgrade;