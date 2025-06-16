import { motion } from 'framer-motion';
import { Settings, Code, Video } from 'lucide-react';

export default function AmyloidosisSection() {
  return (
    <section className="crawford-section bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔬 Smooth & efficient process
          </motion.div>

          <motion.h2
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            An Example Amyloidosis
            Care Support Project
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Process Card 1 */}
          <motion.div
            className="crawford-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Patient Assessment
              & Care Planning
            </h3>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Book a discovery call to discuss your vision and see if 
              we're a perfect match. Afterwards, you'll receive a 
              detailed proposal outlining the scope of work, 
              deliverables, timeline, and pricing.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 aspect-video flex items-center justify-center">
              <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-xs">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-3 bg-blue-200 rounded-full w-1/2"></div>
                  <div className="h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Assessment Form</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Card 2 */}
          <motion.div
            className="crawford-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-8">
              <Code className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Treatment Development
              And Feedback
            </h3>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Once we agree on the scope and you accept the 
              proposal, the treatment plan begins. Using markup, 
              you can provide feedback easily, ensuring a seamless 
              and collaborative process from start to finish.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 aspect-video flex items-center justify-center">
              <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00AFE6] rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-xs text-yellow-700 font-medium">Treatment Protocol</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Card 3 */}
          <motion.div
            className="crawford-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-8">
              <Video className="w-8 h-8 text-purple-600" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Ongoing Support
              Training
            </h3>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Upon your approval of the finished treatment plan, you'll 
              receive bespoke handover training via Loom link. Plus, enjoy 30 days of free email 
              support to help you transition smoothly.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 aspect-video flex items-center justify-center">
              <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-xs relative">
                <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-[#00DD89] rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs text-gray-600">Training Session</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}