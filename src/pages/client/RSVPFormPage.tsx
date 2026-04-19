'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface RSVPFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  contactNumber: string;
  attending: boolean;
  message: string;
}

interface RSVPFormPageProps {
  formData: RSVPFormData;
  formErrors: Record<string, string>;
  loading: boolean;
  onFormChange: (data: RSVPFormData) => void;
  onSubmit: () => void;
}

export function RSVPFormPage({
  formData,
  formErrors,
  loading,
  onFormChange,
  onSubmit,
}: RSVPFormPageProps) {
  return (
    <>
      <LoadingScreen isLoading={loading} />
      <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-pink-100 via-white to-pink-300 px-6 pt-8 pb-12">
        {/* Logo */}
        <div className="mb-2">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events"
            className="h-14 w-auto mx-auto"
          />
        </div>

        {/* Tagline */}
        <p className="mb-6 text-sm font-medium text-gray-600 text-center">
          Your <span className="font-bold text-[#df2b80]">MOST TRUSTED</span> team!
        </p>

        {/* White Card */}
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl px-6 py-7">
          <h2 className="text-xl font-bold text-gray-800 mb-1">A Special Celebration Awaits</h2>
          <p className="text-xs text-gray-500 mb-5">
            We would be honored to have you celebrate this special day with us.
          </p>

          <div className="space-y-3">
            {/* Last Name + First Name side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => onFormChange({ ...formData, lastName: e.target.value })}
                  className={`mt-1 bg-gray-100 border-0 rounded-lg text-sm ${formErrors.lastName ? 'ring-1 ring-red-500' : ''}`}
                />
                {formErrors.lastName && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors.lastName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                  className={`mt-1 bg-gray-100 border-0 rounded-lg text-sm ${formErrors.firstName ? 'ring-1 ring-red-500' : ''}`}
                />
                {formErrors.firstName && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors.firstName}</p>
                )}
              </div>
            </div>

            {/* Middle Name */}
            <div>
              <Label htmlFor="middleName" className="text-xs font-medium text-gray-700">
                Middle Name <span className="text-gray-400 font-normal">(Optional)</span>
              </Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => onFormChange({ ...formData, middleName: e.target.value })}
                className="mt-1 bg-gray-100 border-0 rounded-lg text-sm"
              />
            </div>

            {/* Contact Number */}
            <div>
              <Label htmlFor="contactNumber" className="text-xs font-medium text-gray-700">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                placeholder="0909 000 0000"
                value={formData.contactNumber}
                onChange={(e) => onFormChange({ ...formData, contactNumber: e.target.value })}
                className={`mt-1 bg-gray-100 border-0 rounded-lg text-sm ${formErrors.contactNumber ? 'ring-1 ring-red-500' : ''}`}
              />
              {formErrors.contactNumber && (
                <p className="text-xs text-red-500 mt-0.5">{formErrors.contactNumber}</p>
              )}
            </div>

            {/* Attendance */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Will you be able to attend our special occasion?
              </p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    checked={formData.attending === true}
                    onChange={() => onFormChange({ ...formData, attending: true })}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <span className="text-sm text-gray-700">Yes, I will be attending.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    checked={formData.attending === false}
                    onChange={() => onFormChange({ ...formData, attending: false })}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <span className="text-sm text-gray-700">No, I will not be attending.</span>
                </label>
              </div>
            </div>

            {/* Message */}
            <div>
              <textarea
                id="message"
                placeholder="Leave a message for the host?"
                value={formData.message}
                onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm italic text-gray-400 placeholder:italic resize-none h-20 focus:outline-none focus:ring-2 focus:ring-pink-300 border-0"
              />
            </div>

            {formErrors.submit && (
              <p className="text-sm text-red-500 text-center">{formErrors.submit}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="bg-gradient-to-b from-pink-400 to-pink-600 text-white font-semibold rounded-full px-10 py-2.5 shadow-lg hover:from-pink-500 hover:to-pink-700 active:scale-95 transition disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Form'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
